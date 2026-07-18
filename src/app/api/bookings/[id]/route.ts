import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookingOrders } from "@/db/schema";
import { eq } from "drizzle-orm";

import { sendBookingConfirmationEmails } from "@/utils/sendEmail";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Fetch existing booking to check status change
    const [existingBooking] = await db.select().from(bookingOrders).where(eq(bookingOrders.id, id));
    if (!existingBooking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    const statusChangedToPaid = 
      body.paymentStatus && 
      (body.paymentStatus === "Deposit Paid" || body.paymentStatus === "Fully Paid") &&
      existingBooking.paymentStatus !== body.paymentStatus;

    await db.update(bookingOrders).set(body).where(eq(bookingOrders.id, id));

    // If admin changed status to paid, trigger the email
    if (statusChangedToPaid) {
      let packageData = null;
      // Need to import trekkingPackages
      const { trekkingPackages } = await import("@/db/schema");
      if (existingBooking.packageId) {
        const [pkg] = await db.select().from(trekkingPackages).where(eq(trekkingPackages.id, existingBooking.packageId));
        if (pkg) packageData = pkg;
      }
      
      const parsedCustomer = typeof existingBooking.customer === "string" ? JSON.parse(existingBooking.customer as string) : existingBooking.customer;
      const parsedPricing = typeof existingBooking.pricing === "string" ? JSON.parse(existingBooking.pricing as string) : existingBooking.pricing;
      const parsedParticipants = typeof existingBooking.participants === "string" ? JSON.parse(existingBooking.participants as string) : existingBooking.participants;
      const parsedTrackingSource = typeof existingBooking.trackingSource === "string" ? JSON.parse(existingBooking.trackingSource as string) : existingBooking.trackingSource;

      const updatedBooking = { 
        ...existingBooking, 
        ...body,
        customer: parsedCustomer,
        pricing: parsedPricing,
        participants: parsedParticipants,
        trackingSource: parsedTrackingSource
      };

      await sendBookingConfirmationEmails(updatedBooking, packageData);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(bookingOrders).where(eq(bookingOrders.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
