import "dotenv/config";
import { readFile } from "node:fs/promises";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  multipleStatements: true,
});

try {
  const schema = await readFile(new URL("../database/schema.sql", import.meta.url), "utf8");
  await connection.query(schema);
  console.log("Banco estoque_facil e tabelas criados/atualizados com sucesso.");
} finally {
  await connection.end();
}
