import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
  const results: string[] = [];
  
  const addColumn = async (table: string, columnDef: string) => {
    try {
      await db.execute(sql.raw(`ALTER TABLE ${table} ADD COLUMN ${columnDef}`));
      results.push(`Success: Added ${columnDef} to ${table}`);
    } catch (e: any) {
      if (e.message.includes("Duplicate column name")) {
        results.push(`Skipped: Column already exists in ${table}`);
      } else {
        results.push(`Error adding to ${table}: ${e.message}`);
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

  return NextResponse.json({ success: true, results });
}
