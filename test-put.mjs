const bookingId = "RH-2026-7335";

async function run() {
  console.log("Fetching booking to get its data...");
  const res = await fetch(`http://localhost:3000/api/bookings`);
  const data = await res.json();
  const booking = data.find(b => b.id === bookingId);
  
  if (!booking) {
    console.log("Booking not found");
    return;
  }
  
  console.log("Original Status:", booking.paymentStatus);
  booking.paymentStatus = "Fully Paid";
  
  console.log("Sending PUT request...");
  const putRes = await fetch(`http://localhost:3000/api/bookings/${bookingId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  });
  
  const text = await putRes.text();
  console.log("PUT Response status:", putRes.status);
  console.log("PUT Response body:", text);
}

run();
