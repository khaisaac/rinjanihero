import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookingOrders } from "@/db/schema";

export async function GET() {
  try {
    const data = await db.select().from(bookingOrders);
    
    // Parse JSON fields if they are returned as strings by the DB driver
    const parsedData = data.map((booking) => ({
      ...booking,
      participants: typeof booking.participants === "string" ? JSON.parse(booking.participants) : booking.participants,
      customer: typeof booking.customer === "string" ? JSON.parse(booking.customer) : booking.customer,
      pricing: typeof booking.pricing === "string" ? JSON.parse(booking.pricing) : booking.pricing,
      trackingSource: typeof booking.trackingSource === "string" ? JSON.parse(booking.trackingSource) : booking.trackingSource,
    }));
    
    return NextResponse.json({ success: true, data: parsedData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await db.insert(bookingOrders).values(body);
    return NextResponse.json({ success: true, data: body });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
