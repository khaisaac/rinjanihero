import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookingOrders, trekkingPackages } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { sendBookingConfirmationEmails } from "@/utils/sendEmail";

export async function POST(request: Request) {
  try {
    const bodyText = await request.text();
    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (e) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const clientId = request.headers.get("Client-Id");
    const requestId = request.headers.get("Request-Id");
    const requestTimestamp = request.headers.get("Request-Timestamp");
    const signature = request.headers.get("Signature");

    const dokuSecretKey = process.env.DOKU_SECRET_KEY;

    if (!clientId || !requestId || !requestTimestamp || !signature || !dokuSecretKey) {
      console.error("[DOKU Webhook] Missing headers or DOKU_SECRET_KEY");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Verify Signature
    const requestTarget = "/api/webhooks/doku";
    const digest = crypto.createHash("sha256").update(bodyText, "utf8").digest("base64");
    const componentSignature = `Client-Id:${clientId}\nRequest-Id:${requestId}\nRequest-Timestamp:${requestTimestamp}\nRequest-Target:${requestTarget}\nDigest:${digest}`;
    
    const computedSignature = "HMACSHA256=" + crypto.createHmac("sha256", dokuSecretKey).update(componentSignature).digest("base64");

    if (signature !== computedSignature) {
      console.error("[DOKU Webhook] Signature mismatch. Received:", signature, "Computed:", computedSignature);
      return NextResponse.json({ error: "Invalid Signature" }, { status: 401 });
    }

    // 2. Process Notification Payload
    const transactionStatus = body?.transaction?.status;
    const invoiceNumber = body?.order?.invoice_number;
    const amountPaidIDR = body?.order?.amount;

    if (!invoiceNumber || transactionStatus !== "SUCCESS") {
      // DOKU advises returning 200 OK to acknowledge receipt even if we don't process it (e.g. FAILED status)
      console.log(`[DOKU Webhook] Ignored notification for Invoice: ${invoiceNumber}, Status: ${transactionStatus}`);
      return NextResponse.json({ message: "Acknowledged" }, { status: 200 });
    }

    // 3. Find Booking
    const [booking] = await db.select().from(bookingOrders).where(eq(bookingOrders.orderNumber, invoiceNumber));
    if (!booking) {
      console.error(`[DOKU Webhook] Booking not found for invoice: ${invoiceNumber}`);
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Only process if it's currently Pending, to avoid duplicate processing/emails
    if (booking.paymentStatus !== "Pending") {
      console.log(`[DOKU Webhook] Booking ${invoiceNumber} is already ${booking.paymentStatus}. Ignoring.`);
      return NextResponse.json({ message: "Already processed" }, { status: 200 });
    }

    // 4. Determine Payment Status (Deposit vs Full)
    const pricing = typeof booking.pricing === "string" ? JSON.parse(booking.pricing as string) : booking.pricing;
    const customer = typeof booking.customer === "string" ? JSON.parse(booking.customer as string) : booking.customer;
    const participants = typeof booking.participants === "string" ? JSON.parse(booking.participants as string) : booking.participants;
    const trackingSource = typeof booking.trackingSource === "string" ? JSON.parse(booking.trackingSource as string) : booking.trackingSource;
    
    const totalUSD = pricing.totalUSD;
    
    // Using 18000 as the exchange rate
    const totalIDR = Math.round(totalUSD * 18000);
    
    // If amount paid is close to or greater than total IDR, it's Fully Paid
    const newPaymentStatus = (amountPaidIDR >= totalIDR - 1000) ? "Fully Paid" : "Deposit Paid";
    const paymentMethod = `DOKU Live (${body?.transaction?.payment_method || "N/A"})`;

    const updatedFields = {
      paymentStatus: newPaymentStatus,
      paymentMethod,
      paymentPaidAt: new Date().toISOString(),
    };

    // 5. Update Database
    await db.update(bookingOrders).set(updatedFields).where(eq(bookingOrders.id, booking.id));

    // 6. Trigger Emails
    let packageData = null;
    if (booking.packageId) {
      const [pkg] = await db.select().from(trekkingPackages).where(eq(trekkingPackages.id, booking.packageId));
      if (pkg) packageData = pkg;
    }

    const updatedBooking = { 
      ...booking, 
      ...updatedFields,
      pricing,
      customer,
      participants,
      trackingSource
    };
    await sendBookingConfirmationEmails(updatedBooking, packageData);

    console.log(`[DOKU Webhook] Successfully processed and sent emails for booking: ${invoiceNumber} (${newPaymentStatus})`);
    
    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error: any) {
    console.error("[DOKU Webhook Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
