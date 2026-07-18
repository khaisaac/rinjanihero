import { db } from "./src/db/index.js";
import { bookingOrders } from "./src/db/schema.js";
import { eq } from "drizzle-orm";

async function run() {
  const [existingBooking] = await db.select().from(bookingOrders).limit(1);
  if (!existingBooking) {
    console.log("No booking found");
    return;
  }

  console.log("Original booking:", existingBooking.paymentStatus);

  // Simulate parsing the JSON fields as GET route does
  const parsedCustomer = typeof existingBooking.customer === "string" ? JSON.parse(existingBooking.customer) : existingBooking.customer;
  const parsedPricing = typeof existingBooking.pricing === "string" ? JSON.parse(existingBooking.pricing) : existingBooking.pricing;
  const parsedParticipants = typeof existingBooking.participants === "string" ? JSON.parse(existingBooking.participants) : existingBooking.participants;
  const parsedTrackingSource = typeof existingBooking.trackingSource === "string" ? JSON.parse(existingBooking.trackingSource) : existingBooking.trackingSource;

  // Simulate body from frontend
  const body = {
    ...existingBooking,
    paymentStatus: "Fully Paid",
    customer: parsedCustomer,
    pricing: parsedPricing,
    participants: parsedParticipants,
    trackingSource: parsedTrackingSource,
  };

  console.log("Trying to update booking with body:", body.customer);
  
  try {
    await db.update(bookingOrders).set(body).where(eq(bookingOrders.id, existingBooking.id));
    console.log("Update successful!");
  } catch (err) {
    console.error("Update failed:", err);
  }
}

run().catch(console.error).then(() => process.exit(0));
