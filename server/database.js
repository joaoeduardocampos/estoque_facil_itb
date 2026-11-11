
import "dotenv/config"; 
import mysql from "mysql2/promise";

const required = ["DB_HOST", "DB_USER", "DB_NAME", "JWT_SECRET"];

for (const name of required) {
  if (!process.env[name]) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }
}

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL_SIZE || 10),
  queueLimit: 0,
  charset: "utf8mb4",
  timezone: "Z",
});

export async function checkDatabase() {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
  } finally {
    connection.release();
  }
}
