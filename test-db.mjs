import { db } from "./src/db/index.js";
import { bookingOrders } from "./src/db/schema.js";

async function run() {
  const bookings = await db.select().from(bookingOrders);
  console.log("Found bookings:", bookings.length);
  if (bookings.length > 0) {
    console.log("First booking ID:", bookings[0].id);
    console.log("Status:", bookings[0].paymentStatus);
  }
}
run();
