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
    console.log("Adding column package_types...");
    await connection.execute(`ALTER TABLE trekking_packages ADD COLUMN package_types JSON;`);
    console.log("Column added successfully!");
  } catch (err) {
    if (err.code === "ER_DUP_FIELDNAME") {
      console.log("Column already exists.");
    } else {
      console.error("Error adding column:", err);
    }
  } finally {
    await connection.end();
  }
}

run();
