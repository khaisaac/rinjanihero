import { NextResponse } from "next/server";
import { db } from "@/db";
import { websiteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db.select().from(websiteSettings).limit(1);
    const data = rows[0] || null;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const rows = await db.select().from(websiteSettings).where(eq(websiteSettings.id, "default"));
    
    if (rows.length === 0) {
      await db.insert(websiteSettings).values({ id: "default", ...body });
    } else {
      await db.update(websiteSettings).set(body).where(eq(websiteSettings.id, "default"));
    }
    
    return NextResponse.json({ success: true, message: "Settings updated successfully" });
  } catch (error: any) {
    console.error("PUT /api/settings error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
