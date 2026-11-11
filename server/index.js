import "dotenv/config";
import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { z } from "zod";
import { allowRoles, authenticate, createToken } from "./auth.js";
import { checkDatabase, pool } from "./database.js";

const app = express();
const port = Number(process.env.PORT || 3001);
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: false }));
app.use(express.json({ limit: "2mb" }));
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

const registerSchema = z.object({
  fullName: z.string().trim().min(3).max(150),
  username: z.string().trim().min(3).max(60).regex(/^[a-zA-Z0-9._-]+$/),
  document: z.string().trim().min(11).max(20),
  companyName: z.string().trim().min(2).max(150),
  activity: z.string().trim().min(2).max(100),
  cep: z.string().trim().min(8).max(9),
  address: z.string().trim().min(3).max(200),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().length(2).transform((value) => value.toUpperCase()),
  email: z.email().transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(72),
});

const loginSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(72),
});

const productSchema = z.object({
  name: z.string().trim().min(1).max(150),
  category: z.string().trim().min(1).max(100),
  brand: z.string().trim().max(100).default(""),
  model: z.string().trim().max(120).default(""),
  quantity: z.coerce.number().int().min(0).default(0),
  costPrice: z.coerce.number().min(0).default(0),
  salePrice: z.coerce.number().min(0).default(0),
  entryQuantity: z.coerce.number().int().min(0).default(0),
  exitQuantity: z.coerce.number().int().min(0).default(0),
  image: z.string().max(2000).optional().nullable(),
});

function parse(schema, body, res) {
  const result = schema.safeParse(body);
  if (!result.success) {
    res.status(400).json({
      message: "Revise os campos informados.",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return null;
  }
  return result.data;
}

function publicUser(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    fullName: row.full_name,
    username: row.username,
    email: row.email,
    role: row.role,
    status: row.status,
  };
}

app.get("/api/health", async (_req, res, next) => {
  try {
    await checkDatabase();
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/register", async (req, res, next) => {
  const data = parse(registerSchema, req.body, res);
  if (!data) return;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const passwordHash = await bcrypt.hash(data.password, 12);

    const [companyResult] = await connection.execute(
      `INSERT INTO companies
        (name, document, activity, cep, address, city, state)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.companyName,
        data.document.replace(/\D/g, ""),
        data.activity,
        data.cep.replace(/\D/g, ""),
        data.address,
        data.city,
        data.state,
      ],
    );

    const [userResult] = await connection.execute(
      `INSERT INTO users
        (company_id, full_name, username, email, password_hash, role, status)
       VALUES (?, ?, ?, ?, ?, 'master', 'active')`,
      [companyResult.insertId, data.fullName, data.username, data.email, passwordHash],
    );

    await connection.commit();
    res.status(201).json({
      message: "Conta criada. O primeiro usuário da empresa recebeu o perfil Master.",
      userId: userResult.insertId,
    });
  } catch (error) {
    await connection.rollback();
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "E-mail ou nome de usuário já cadastrado." });
    }
    next(error);
  } finally {
    connection.release();
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  const data = parse(loginSchema, req.body, res);
  if (!data) return;

  try {
    const [rows] = await pool.execute(
      `SELECT id, company_id, full_name, username, email, password_hash, role, status
       FROM users WHERE email = ? LIMIT 1`,
      [data.email],
    );
    const user = rows[0];
    const validPassword = user && (await bcrypt.compare(data.password, user.password_hash));

    if (!validPassword) {
      return res.status(401).json({ message: "E-mail ou senha incorretos." });
    }
    if (user.status !== "active") {
      return res.status(403).json({ message: "Este usuário está inativo ou bloqueado." });
    }

    await pool.execute("UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?", [user.id]);
    res.json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/auth/me", authenticate, async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, company_id, full_name, username, email, role, status
       FROM users WHERE id = ? AND company_id = ? LIMIT 1`,
      [req.auth.userId, req.auth.companyId],
    );
    if (!rows[0] || rows[0].status !== "active") {
      return res.status(401).json({ message: "Usuário não está ativo." });
    }
    res.json({ user: publicUser(rows[0]) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/products", authenticate, async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, name, category, brand, model, quantity,
              CAST(cost_price AS DOUBLE) AS costPrice,
              CAST(sale_price AS DOUBLE) AS salePrice,
              entry_quantity AS entryQuantity, exit_quantity AS exitQuantity,
              DATE_FORMAT(created_at, '%d/%m/%Y') AS addedAt, image_url AS image
       FROM products
       WHERE company_id = ?
       ORDER BY created_at DESC`,
      [req.auth.companyId],
    );
    res.json({ products: rows });
  } catch (error) {
    next(error);
  }
});

app.post("/api/products", authenticate, async (req, res, next) => {
  const data = parse(productSchema, req.body, res);
  if (!data) return;

  try {
    const finalQuantity = Math.max(0, data.quantity + data.entryQuantity - data.exitQuantity);
    const [result] = await pool.execute(
      `INSERT INTO products
        (company_id, name, category, brand, model, quantity, cost_price, sale_price,
         entry_quantity, exit_quantity, image_url, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.auth.companyId,
        data.name,
        data.category,
        data.brand,
        data.model,
        finalQuantity,
        data.costPrice,
        data.salePrice,
        data.entryQuantity,
        data.exitQuantity,
        data.image || null,
        req.auth.userId,
      ],
    );

    if (data.entryQuantity > 0 || data.exitQuantity > 0) {
      const type = data.entryQuantity > 0 ? "entry" : "exit";
      const amount = data.entryQuantity > 0 ? data.entryQuantity : data.exitQuantity;
      await pool.execute(
        `INSERT INTO inventory_movements
          (company_id, product_id, user_id, type, quantity, notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [req.auth.companyId, result.insertId, req.auth.userId, type, amount, "Cadastro inicial"],
      );
    }

    res.status(201).json({ id: result.insertId, message: "Produto cadastrado." });
  } catch (error) {
    next(error);
  }
});

app.delete(
  "/api/products/:id",
  authenticate,
  allowRoles("master", "admin"),
  async (req, res, next) => {
    try {
      const [result] = await pool.execute(
        "DELETE FROM products WHERE id = ? AND company_id = ?",
        [Number(req.params.id), req.auth.companyId],
      );
      if (!result.affectedRows) {
        return res.status(404).json({ message: "Produto não encontrado." });
      }
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  },
);

app.get(
  "/api/users",
  authenticate,
  allowRoles("master", "admin"),
  async (req, res, next) => {
    try {
      const [rows] = await pool.execute(
        `SELECT id, full_name AS fullName, username, email, role, status,
                created_at AS createdAt, last_login_at AS lastLoginAt
         FROM users WHERE company_id = ? ORDER BY created_at`,
        [req.auth.companyId],
      );
      res.json({ users: rows });
    } catch (error) {
      next(error);
    }
  },
);

app.patch(
  "/api/users/:id/role",
  authenticate,
  allowRoles("master"),
  async (req, res, next) => {
    const result = z.enum(["admin", "user"]).safeParse(req.body.role);
    if (!result.success) {
      return res.status(400).json({ message: "Perfil inválido." });
    }
    if (Number(req.params.id) === req.auth.userId) {
      return res.status(400).json({ message: "O Master não pode remover o próprio acesso." });
    }
    try {
      const [update] = await pool.execute(
        `UPDATE users SET role = ?
         WHERE id = ? AND company_id = ? AND role <> 'master'`,
        [result.data, Number(req.params.id), req.auth.companyId],
      );
      if (!update.affectedRows) {
        return res.status(404).json({ message: "Usuário não encontrado ou protegido." });
      }
      res.json({ message: "Perfil atualizado." });
    } catch (error) {
      next(error);
    }
  },
);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Erro interno do servidor."
        : error.message || "Erro interno do servidor.",
  });
});

app.listen(port, async () => {
  try {
    await checkDatabase();
    console.log(`API Estoque Fácil em http://localhost:${port}`);
  } catch (error) {
    console.error("A API iniciou, mas não conseguiu conectar ao MySQL:", error.message);
  }
});
