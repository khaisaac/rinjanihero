import { Resend } from "resend";
import { parseArray } from "@/utils/jsonParser";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_rinjani_hero_key");

export async function sendBookingConfirmationEmails(booking: any, packageData?: any) {
  try {
    console.log(`[Email Service] Dispatching DOKU Payment & E-Ticket confirmation for Order #${booking.orderNumber}`);

    const customerEmail = booking?.customer?.email;
    const adminEmail = "herorinjani@gmail.com";

    const includesList = packageData?.includes ? parseArray(packageData.includes) : [
      "Certified Mount Rinjani National Park Local Guide & Porters",
      "All Camping Equipment (Tents, Thick Mattresses, Sleeping Bags, Camping Chair & Table)",
      "3x Daily Gourmet Expedition Meals, Fresh Fruits, Hot Coffee/Tea, and Energy Snacks",
      "Official Mount Rinjani National Park Entry Permits and Trekking Insurance",
      "Free Pick-up & Return Transfers around Lombok (Airport, Senggigi, Bangsal Harbor, Mataram)",
      "Complimentary Homestay Accommodation 1 Night Before Trek at Senaru Basecamp",
    ];

    const excludesList = packageData?.excludes ? parseArray(packageData.excludes) : [
      "International / Domestic Flight Tickets and Airport Taxes",
      "Personal Travel / Medical Insurance outside National Park coverage",
      "Personal Porter for private daypack luggage ($25 USD / day)",
      "Tipping and Gratuities for Guides and Porters team",
      "Extra personal items (Headlamp, Trekking Boots, Warm Jackets, Sunscreen)",
    ];

    const packageDescription = packageData?.overview || packageData?.shortDescription || booking.packageTitle || "Experience the breathtaking beauty of Mount Rinjani with experienced local guides, certified safety equipment, and all-inclusive service.";
    
    const amountPaidUSD = booking.paymentStatus === "Fully Paid" ? booking.pricing.totalUSD : booking.pricing.depositRequiredUSD;
    const remainingBalanceUSD = booking.paymentStatus === "Fully Paid" ? 0 : booking.pricing.remainingBalanceUSD;
    const isFullPayment = booking.paymentStatus === "Fully Paid";

    // 1. Client Email Template
    const clientHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F8FAF9; margin: 0; padding: 20px; color: #122826; }
    .container { max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #E5E7EB; }
    .header { background: linear-gradient(135deg, #122826 0%, #18979B 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; }
    .header p { margin: 8px 0 0; font-size: 13px; color: #FEF9EB; opacity: 0.9; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }
    .badge { display: inline-block; background: #D4A017; color: #122826; font-weight: 800; font-size: 12px; padding: 6px 16px; border-radius: 20px; text-transform: uppercase; margin-top: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
    .content { padding: 32px 30px; }
    .section-title { font-size: 16px; font-weight: 800; color: #122826; text-transform: uppercase; letter-spacing: 0.5px; margin: 24px 0 12px; padding-bottom: 8px; border-bottom: 2px solid #18979B; }
    .info-grid { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .info-grid td { padding: 10px 12px; border-bottom: 1px solid #F3F4F6; font-size: 14px; }
    .info-grid td.label { font-weight: 700; color: #4B5563; width: 40%; background: #F9FAFB; }
    .info-grid td.value { font-weight: 600; color: #111827; }
    .barcode-box { background: #122826; color: #D4A017; padding: 16px; border-radius: 12px; text-align: center; font-family: monospace; font-size: 18px; font-weight: 900; letter-spacing: 2px; margin: 20px 0; border: 2px dashed #18979B; }
    .package-box { background: #F8FAF9; border: 1px solid #18979B; border-radius: 12px; padding: 20px; margin-top: 20px; }
    .package-box h3 { margin: 0 0 10px; color: #122826; font-size: 18px; font-weight: 800; }
    .package-box p { margin: 0; font-size: 14px; color: #4B5563; line-height: 1.6; }
    .list-item { font-size: 13px; line-height: 1.6; padding: 6px 0; border-bottom: 1px dashed #E5E7EB; }
    .list-item:last-child { border-bottom: none; }
    .footer { background: #122826; color: #ffffff; padding: 24px 30px; text-align: center; font-size: 12px; line-height: 1.6; }
    .footer a { color: #D4A017; text-decoration: none; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>RINJANI HERO EXPEDITIONS</h1>
      <p>Official Senaru Basecamp • Licensed National Park Operator</p>
      <div class="badge">E-TICKET & PERMIT CONFIRMED (${booking.paymentStatus})</div>
    </div>

    <div class="content">
      <p style="font-size: 16px; line-height: 1.6; color: #374151;">
        Dear <strong>${booking?.customer?.fullName}</strong>,<br><br>
        Congratulations! Your DOKU secure transaction has been successfully verified. Your expedition registration and Mount Rinjani National Park e-permit have been officially secured under order number <strong>#${booking.orderNumber}</strong>.
      </p>

      <div class="barcode-box">
        RH-ERINJANI-${(booking?.id || "8888").slice(-4).toUpperCase()}
      </div>

      <div class="section-title">Expedition & Reservation Summary</div>
      <table class="info-grid">
        <tr><td class="label">Order Number</td><td class="value">#${booking.orderNumber}</td></tr>
        <tr><td class="label">Trekking Package</td><td class="value" style="color:#18979B;">${booking.packageTitle}</td></tr>
        <tr><td class="label">Scheduled Trek Date</td><td class="value font-bold">${booking.trekDate}</td></tr>
        <tr><td class="label">Group Size</td><td class="value">${booking?.participants?.adults || 1} Adults, ${booking?.participants?.children || 0} Children</td></tr>
        <tr><td class="label">Payment Status</td><td class="value font-bold" style="color:#10B981;">${booking.paymentStatus} (Verified)</td></tr>
        <tr><td class="label">Total Expedition Cost</td><td class="value font-bold">$${booking?.pricing?.totalUSD} USD</td></tr>
        <tr><td class="label">Amount Paid Today</td><td class="value font-bold" style="color:#18979B;">$${amountPaidUSD} USD</td></tr>
        <tr><td class="label">Remaining Balance</td><td class="value font-bold" style="color:${isFullPayment ? '#10B981' : '#D4A017'};">$${remainingBalanceUSD} USD ${isFullPayment ? '(Fully Settled Upfront!)' : '(Payable in cash USD/IDR upon basecamp check-in)'}</td></tr>
      </table>

      <div class="section-title">Client Information & Emergency Profile</div>
      <table class="info-grid">
        <tr><td class="label">Lead Guest Name</td><td class="value">${booking?.customer?.fullName}</td></tr>
        <tr><td class="label">Contact WhatsApp/Phone</td><td class="value">${booking?.customer?.phone}</td></tr>
        <tr><td class="label">Email Address</td><td class="value">${booking?.customer?.email}</td></tr>
        <tr><td class="label">Passport / ID Number</td><td class="value">${booking?.customer?.passportNumber || "N/A"}</td></tr>
        <tr><td class="label">Nationality / Country</td><td class="value">${booking?.customer?.country}</td></tr>
        <tr><td class="label">Dietary & Medical Notes</td><td class="value">${booking?.customer?.dietaryNotes || "None reported"}</td></tr>
        <tr><td class="label">Emergency Contact</td><td class="value">${booking?.customer?.emergencyContact || "N/A"}</td></tr>
      </table>

      <div class="package-box">
        <h3>📦 Selected Package: ${booking.packageTitle}</h3>
        <p>${packageDescription}</p>
      </div>

      <div class="section-title">✅ What is Included in Your Package</div>
      <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:12px; padding:16px;">
        ${includesList.map((inc: string) => `<div class="list-item" style="color:#166534;"><strong>✅</strong> ${inc}</div>`).join("")}
      </div>

      <div class="section-title">❌ What is Excluded</div>
      <div style="background:#FEF2F2; border:1px solid #FECACA; border-radius:12px; padding:16px;">
        ${excludesList.map((exc: string) => `<div class="list-item" style="color:#991B1B;"><strong>❌</strong> ${exc}</div>`).join("")}
      </div>

      <div style="margin-top:28px; padding:20px; background:#FEF9EB; border-left:4px solid #D4A017; border-radius:8px;">
        <h4 style="margin:0 0 8px; color:#122826; font-size:14px; font-weight:800;">📍 Next Steps & Check-in Guidance:</h4>
        <p style="margin:0; font-size:13px; color:#4B5563; line-height:1.6;">
          Our basecamp team will pick you up anywhere in Lombok (Airport, Senggigi, Bangsal Harbor, Mataram) 1 day prior to your trek date and transfer you to Senaru basecamp for check-in and briefing. Please keep this e-ticket ready on your mobile device.
        </p>
      </div>
    </div>

    <div class="footer">
      <p style="margin:0 0 8px; font-weight:bold; font-size:14px;">RINJANI HERO EXPEDITIONS SENARU BASECAMP</p>
      <p style="margin:0 0 8px;">Jalan Pariwisata Senaru, Bayan, North Lombok, West Nusa Tenggara 83354, Indonesia</p>
      <p style="margin:0;">Emergency & WhatsApp 24/7: <a href="https://wa.me/6285338938083">+62 853 3893 8083</a> | Email: <a href="mailto:herorinjani@gmail.com">herorinjani@gmail.com</a></p>
    </div>
  </div>
</body>
</html>
    `;

    // 2. Admin Notification Email Template (To: herorinjani@gmail.com)
    const adminHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #111827; margin: 0; padding: 20px; color: #1F2937; }
    .container { max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 25px rgba(0,0,0,0.3); border: 2px solid #D4A017; }
    .header { background: #122826; padding: 30px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 900; color: #D4A017; }
    .header p { margin: 6px 0 0; font-size: 13px; color: #E5E7EB; }
    .content { padding: 30px; }
    .alert-banner { background: #FEF2F2; border: 2px solid #EF4444; border-radius: 12px; padding: 16px; color: #991B1B; font-weight: 800; text-align: center; font-size: 15px; margin-bottom: 24px; }
    .section-title { font-size: 15px; font-weight: 800; color: #122826; text-transform: uppercase; margin: 20px 0 10px; border-bottom: 2px solid #D4A017; padding-bottom: 6px; }
    .info-grid { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .info-grid td { padding: 10px; border-bottom: 1px solid #F3F4F6; font-size: 13px; }
    .info-grid td.label { font-weight: 700; color: #4B5563; width: 40%; background: #F9FAFB; }
    .info-grid td.value { font-weight: 600; color: #111827; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚨 NEW DOKU PAID BOOKING RECEIVED</h1>
      <p>Rinjani Hero Expedition CMS Admin Control Panel</p>
    </div>

    <div class="content">
      <div class="alert-banner">
        TRANSACTION VERIFIED & E-TICKET ISSUED TO CLIENT<br>
        Order #${booking.orderNumber} • ${booking.paymentStatus.toUpperCase()} ($${amountPaidUSD} USD)
      </div>

      <div class="section-title">Client Personal & Contact Profile</div>
      <table class="info-grid">
        <tr><td class="label">Full Name</td><td class="value font-bold">${booking?.customer?.fullName}</td></tr>
        <tr><td class="label">Email Address</td><td class="value">${booking?.customer?.email}</td></tr>
        <tr><td class="label">WhatsApp / Phone</td><td class="value"><a href="https://wa.me/${(booking?.customer?.phone || '').replace(/[^0-9]/g, '')}">${booking?.customer?.phone}</a></td></tr>
        <tr><td class="label">Passport / ID Number</td><td class="value">${booking?.customer?.passportNumber || "N/A"}</td></tr>
        <tr><td class="label">Country / Nationality</td><td class="value">${booking?.customer?.country}</td></tr>
        <tr><td class="label">Dietary & Medical Notes</td><td class="value" style="color:#EF4444; font-weight:800;">${booking?.customer?.dietaryNotes || "None"}</td></tr>
        <tr><td class="label">Emergency Contact</td><td class="value">${booking?.customer?.emergencyContact || "N/A"}</td></tr>
      </table>

      <div class="section-title">Financial & Expedition Schedule</div>
      <table class="info-grid">
        <tr><td class="label">Order ID</td><td class="value font-bold">#${booking.orderNumber}</td></tr>
        <tr><td class="label">Package Chosen</td><td class="value font-bold" style="color:#18979B;">${booking.packageTitle}</td></tr>
        <tr><td class="label">Trek Date</td><td class="value font-bold" style="color:#D4A017; font-size:15px;">${booking.trekDate}</td></tr>
        <tr><td class="label">Group Participants</td><td class="value">${booking?.participants?.adults || 1} Adults, ${booking?.participants?.children || 0} Children</td></tr>
        <tr><td class="label">Payment Status</td><td class="value font-bold" style="color:#10B981;">${booking.paymentStatus}</td></tr>
        <tr><td class="label">Total Price</td><td class="value font-bold">$${booking?.pricing?.totalUSD} USD</td></tr>
        <tr><td class="label">Paid Online Today</td><td class="value font-bold" style="color:#10B981;">$${amountPaidUSD} USD</td></tr>
        <tr><td class="label">Remaining Balance Due at Basecamp</td><td class="value font-bold" style="color:#EF4444; font-size:15px;">$${remainingBalanceUSD} USD</td></tr>
      </table>

      <div class="section-title">Operational Guide: Package Details & Equipment Checklist</div>
      <div style="background:#F9FAFB; padding:16px; border-radius:12px; font-size:13px; line-height:1.6; margin-bottom:16px;">
        <strong>Description:</strong> ${packageDescription}
      </div>

      <div style="font-size:13px; font-weight:800; color:#166534; margin-top:12px;">✅ MUST PROVIDE (INCLUDES):</div>
      <ul style="margin:6px 0 16px; padding-left:20px; font-size:13px; color:#374151;">
        ${includesList.map((inc: string) => `<li>${inc}</li>`).join("")}
      </ul>

      <div style="font-size:13px; font-weight:800; color:#991B1B; margin-top:12px;">❌ NOT INCLUDED (EXCLUDES):</div>
      <ul style="margin:6px 0; padding-left:20px; font-size:13px; color:#6B7280;">
        ${excludesList.map((exc: string) => `<li>${exc}</li>`).join("")}
      </ul>
    </div>
  </div>
</body>
</html>
    `;

    // Dispatch Emails via Resend (or log clearly if RESEND_API_KEY is dummy during development/simulation)
    if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("dummy")) {
      const results = await Promise.all([
        // Send to Client
        customerEmail
          ? resend.emails.send({
              from: "Rinjani Hero Expeditions <permits@rinjanihero.org>",
              to: [customerEmail],
              subject: `🏔️ OFFICIAL E-TICKET & PERMIT CONFIRMED: ${booking.packageTitle} | Order #${booking.orderNumber}`,
              html: clientHtml,
            })
          : Promise.resolve(null),

        // Send to Admin (herorinjani@gmail.com)
        resend.emails.send({
          from: "Rinjani Hero Booking System <system@rinjanihero.org>",
          to: [adminEmail],
          subject: `🚨 NEW PAID BOOKING: #${booking.orderNumber} (${booking?.customer?.fullName}) - ${booking.packageTitle}`,
          html: adminHtml,
        }),
      ]);

      console.log(`[Email Service] Emails successfully dispatched via Resend API to ${customerEmail} & ${adminEmail}`, results);
      return { success: true, clientEmail: customerEmail, adminEmail, results };
    } else {
      console.log(`[Email Service Simulation] RESEND_API_KEY not configured or is demo. Email HTML generated successfully for Client (${customerEmail}) & Admin (${adminEmail}).`);
      return { success: true, clientEmail: customerEmail, adminEmail, simulated: true };
    }
  } catch (error: any) {
    console.error("[Email Service Error] Failed to dispatch Resend emails:", error);
    return { success: false, error: error?.message || "Email dispatch failed" };
  }
}
