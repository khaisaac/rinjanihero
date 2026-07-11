import { NextResponse } from "next/server";
import { db } from "@/db";
import { transportationServices } from "@/db/schema";

export async function GET() {
  try {
    const data = await db.select().from(transportationServices);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await db.insert(transportationServices).values(body);
    return NextResponse.json({ success: true, data: body });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
