import jwt from "jsonwebtoken";

export function createToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      companyId: user.company_id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" },
  );
}

export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Sessão não encontrada." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = {
      userId: Number(payload.sub),
      companyId: Number(payload.companyId),
      role: payload.role,
    };
    return next();
  } catch {
    return res.status(401).json({ message: "Sessão inválida ou expirada." });
  }
}

export function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return res.status(403).json({ message: "Você não possui permissão para esta ação." });
    }
    return next();
  };
}
