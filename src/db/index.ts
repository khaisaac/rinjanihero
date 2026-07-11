import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

// Menyiapkan pool koneksi MySQL
const poolConnection = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "u925900205_trekkingmrinja",
  password: process.env.DB_PASSWORD || "sTEREO123.",
  database: process.env.DB_NAME || "u925900205_trekkingmrin",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = drizzle(poolConnection, { schema, mode: "default" });
export type dbType = typeof db;
