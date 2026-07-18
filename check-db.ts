import { db } from "./src/db/index.js";
import { bookingOrders } from "./src/db/schema.js";

async function checkDB() {
  const bookings = await db.select().from(bookingOrders);
  console.log("Total Bookings:", bookings.length);
  const target = bookings.find(b => b.orderNumber === "RH-2026-7335" || b.id === "RH-2026-7335");
  if (target) {
    console.log("Target Booking found!");
    console.log("ID:", target.id);
    console.log("Status:", target.paymentStatus);
    console.log("Customer:", typeof target.customer === "string" ? JSON.parse(target.customer) : target.customer);
  } else {
    console.log("Booking not found. Listing all IDs:");
    bookings.forEach(b => console.log(b.id, b.paymentStatus));
  }
}
checkDB().catch(console.error).then(() => process.exit(0));
