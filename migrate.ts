import { db } from "./src/db/index.js";
import { sql } from "drizzle-orm";

async function run() {
  console.log("Applying schema migration...");
  try {
    await db.execute(sql`
      ALTER TABLE website_settings
      ADD COLUMN package_standard_desc TEXT,
      ADD COLUMN package_private_desc TEXT,
      ADD COLUMN package_meeting_point_desc TEXT;
    `);
    console.log("Migration successful!");
  } catch (err: any) {
    if (err.message.includes("Duplicate column name")) {
      console.log("Columns already exist, skipping.");
    } else {
      console.error("Migration failed:", err);
    }
  }
}

run().then(() => process.exit(0));
