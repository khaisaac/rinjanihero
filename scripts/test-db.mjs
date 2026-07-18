import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "srv1987.hstgr.io",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "u925900205_rinjaniheroo",
    password: process.env.DB_PASSWORD || "sTEREO123.",
    database: process.env.DB_NAME || "u925900205_rinjaniheroo",
  });

  try {
    const [rows] = await connection.execute(`SELECT id, slug, package_types FROM trekking_packages WHERE slug = '2d1n-sembalun-summit'`);
    console.log(JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await connection.end();
  }
}

run();
