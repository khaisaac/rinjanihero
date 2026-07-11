import { NextResponse } from "next/server";
import { db } from "@/db";
import { etickets } from "@/db/schema";
import { parseArray } from "@/utils/jsonParser";

const normalizeETicket = (ticket: any) => ({
  ...ticket,
  features: parseArray(ticket.features),
  requirements: parseArray(ticket.requirements),
});

export async function GET() {
  try {
    const rawData = await db.select().from(etickets);
    const data = rawData.map(normalizeETicket);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await db.insert(etickets).values(body);
    return NextResponse.json({ success: true, data: body });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
