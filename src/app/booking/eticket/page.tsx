"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCMSStore } from "@/store/cmsStore";

export default function ETicketBookingPage() {
  const router = useRouter();
  const { eTickets, bookingPrefill, addBooking } = useCMSStore();

  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    bookingPrefill?.packageId || eTickets[0]?.id || ""
  );
  
  const [adults, setAdults] = useState<number>(bookingPrefill?.adults || 2);

  // New fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [membersDataText, setMembersDataText] = useState(
`Member 1:
1. Full Name:
2. Passport Number:
3. Nationality:
4. Gender:
5. Birthday:

(Copy the format above for member 2, 3, etc.)`
  );
  const [orderNote, setOrderNote] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const selectedTicket = eTickets.find((t) => t.id === selectedTicketId) || eTickets[0];

  // Calculate pricing
  const basePricePerPerson = selectedTicket?.priceUSD || 0;
  const subtotal = basePricePerPerson * adults;
  const finalTotalUSD = subtotal;
  const finalTotalIDR = Math.round(finalTotalUSD * 18000);
  
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !whatsapp || !arrivalDate || !membersDataText) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (adults < 1) {
      setErrorMsg("Number of participants must be at least 1.");
      return;
    }

    const newBookingId = `book-${Date.now().toString().slice(-6)}`;
    const orderNumber = `RH-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    addBooking({
      id: newBookingId,
      orderNumber,
      createdAt: new Date().toISOString(),
      serviceType: "E-Ticket",
      packageId: selectedTicket?.id,
      packageTitle: selectedTicket?.title || "E-Rinjani Ticket",
      trekDate: arrivalDate,
      participants: {
        adults,
        children: 0,
        extraPorters: 0,
        privateGuide: false,
      },
      customer: {
        fullName,
        email,
        whatsapp,
        pickupLocation: "N/A (E-Ticket Only)",
        membersDataText,
        arrivalDate,
        orderNote,
      },
      pricing: {
        basePricePerPerson,
        subtotal: finalTotalUSD,
        extrasTotal: 0,
        discountAmount: 0,
        totalUSD: finalTotalUSD,
        totalIDR: finalTotalIDR,
        depositRequiredUSD: finalTotalUSD, // 100% upfront
        remainingBalanceUSD: 0,
      },
      paymentStatus: "Pending",
      trackingSource: {
        referrer: sessionStorage.getItem("rh_referrer") || "Direct / Organic",
        returnUrl: sessionStorage.getItem("rh_return_url") || "/",
        utmSource: sessionStorage.getItem("rh_utm_source") || "direct",
        utmMedium: sessionStorage.getItem("rh_utm_medium") || "none",
        utmCampaign: sessionStorage.getItem("rh_utm_campaign") || "none",
        websiteSource: "E-Ticket Checkout",
      },
    });

    // Pass the payment option via query parameter to the payment processing page
    router.push(`/booking/payment/${newBookingId}?paymentOption=full`);
  };

  return (
    <div className="bg-[#F4F7F9] min-h-screen py-10 font-sans text-[#122826]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#122826]">E-Ticket Secure Checkout</h1>
          <p className="text-gray-500 text-sm mt-1">Register for Mount Rinjani National Park official entrance ticket.</p>
        </div>

        <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-6">
            
            {errorMsg && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-semibold border border-red-200">
                {errorMsg}
              </div>
            )}

            <div className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Select E-Ticket Type *</label>
                <select
                  value={selectedTicketId}
                  onChange={(e) => setSelectedTicketId(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-semibold"
                >
                  {eTickets.map((t) => (
                    <option key={t.id} value={t.id}>{t.title} - ${t.priceUSD}/person</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name (Lead Booker) *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">WhatsApp Number *</label>
                  <input
                    type="text"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+628123456789"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Number of Tickets (Pax) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={adults}
                    onChange={(e) => setAdults(parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Entry Date (Arrival Date) *</label>
                <input
                  type="date"
                  required
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">Participants Passports & Data <span className="text-red-500">*</span></label>
                <p className="text-[10px] text-gray-400 mb-2">Compulsory data required by Mount Rinjani National Park authority for insurance & permits.</p>
                <textarea
                  required
                  rows={8}
                  value={membersDataText}
                  onChange={(e) => setMembersDataText(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-mono text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Order Note (Optional)</label>
                <textarea
                  rows={2}
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="pt-6">
              <h3 className="text-base font-bold text-[#122826] mb-4">Payment Method</h3>
              <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-4 mb-4 text-xs text-blue-800">
                <strong>Notice:</strong> National Park E-Tickets require 100% upfront payment to secure the quota directly with the park authorities.
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col justify-center">
                <div className="bg-red-600 text-white font-black text-xs px-2 py-0.5 rounded w-max tracking-widest italic mb-2">DOKU</div>
                <p className="text-[11px] text-gray-500">Checkout securely using DOKU payment gateway.</p>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg transition text-sm flex items-center justify-center"
              >
                Proceed to Payment (${finalTotalUSD} USD)
              </button>
            </div>

          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-4 sticky top-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-base font-bold text-[#122826]">Ticket Summary</h3>
              </div>
              <div className="p-5 space-y-4 text-sm text-gray-600">
                <div className="flex justify-between border-b border-gray-100 border-dotted pb-3 gap-4">
                  <span className="text-gray-500 shrink-0">Ticket Type</span>
                  <span className="font-semibold text-[#122826] text-right leading-tight">{selectedTicket?.title}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 border-dotted pb-3">
                  <span className="text-gray-500">Entry Date</span>
                  <span className="font-semibold text-[#122826]">{arrivalDate || "-"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 border-dotted pb-3">
                  <span className="text-gray-500">Price per Pax</span>
                  <span className="font-semibold text-[#122826]">${basePricePerPerson} USD</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 border-dotted pb-3">
                  <span className="text-gray-500">Participants</span>
                  <span className="font-semibold text-[#122826]">{adults} Pax</span>
                </div>
              </div>
              <div className="p-5 bg-gray-50 flex justify-between items-center">
                <span className="font-bold text-[#122826]">Total Due</span>
                <span className="text-lg font-black text-emerald-500">${finalTotalUSD} USD</span>
              </div>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
