import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  const results = [];
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const addColumn = async (table: string, columnDef: string) => {
      try {
        await connection.query(`ALTER TABLE ${table} ADD COLUMN ${columnDef}`);
        results.push(`Success: Added ${columnDef} to ${table}`);
      } catch (e: any) {
        if (e.code === "ER_DUP_FIELDNAME") {
          results.push(`Skipped: Column already exists in ${table}`);
        } else {
          results.push(`Error adding to ${table}: ${e.code} - ${e.message}`);
        }
      }
    };

    await addColumn("booking_orders", "package_type VARCHAR(100) NULL");
    await addColumn("booking_orders", "tracking_source JSON NULL");
    await addColumn("booking_orders", "service_type VARCHAR(100) NULL DEFAULT 'Trekking'");
    await addColumn("booking_orders", "package_id VARCHAR(100) NULL");
    await addColumn("trekking_packages", "pricing_matrix JSON NULL");
    await addColumn("trekking_packages", "related_package_ids JSON NULL");
    await addColumn("trekking_packages", "seo_title VARCHAR(255) NULL DEFAULT 'Trekking Package'");
    await addColumn("trekking_packages", "seo_description TEXT NULL");

    await connection.end();
    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, code: err.code });
  }
}
