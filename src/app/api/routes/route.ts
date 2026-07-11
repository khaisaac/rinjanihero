import { NextResponse } from "next/server";
import { db } from "@/db";
import { routes } from "@/db/schema";
import { parseArray } from "@/utils/jsonParser";

const normalizeRoute = (route: any) => ({
  ...route,
  highlights: parseArray(route.highlights),
});

export async function GET() {
  try {
    const rawData = await db.select().from(routes);
    const data = rawData.map(normalizeRoute);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await db.insert(routes).values(body);
    return NextResponse.json({ success: true, data: body });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
