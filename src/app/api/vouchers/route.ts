import { NextResponse } from "next/server";
import { db } from "@/db";
import { vouchers } from "@/db/schema";

export async function GET() {
  try {
    const data = await db.select().from(vouchers);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await db.insert(vouchers).values(body);
    return NextResponse.json({ success: true, data: body });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
