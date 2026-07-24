"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCMSStore } from "@/store/cmsStore";
import { ServiceType, PackageType } from "@/types/cms";

export default function BookingPage() {
  const router = useRouter();
  const { packages, bookingPrefill, addBooking } = useCMSStore();

  const [serviceType, setServiceType] = useState<ServiceType>(bookingPrefill?.serviceType || "Trekking");
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    bookingPrefill?.packageId || packages[0]?.id || ""
  );
  const [packageType, setPackageType] = useState<PackageType>(bookingPrefill?.packageType || "Standard");

  const [trekDate, setTrekDate] = useState<string>(
    bookingPrefill?.date || new Date(Date.now() + 86400000 * 10).toISOString().split("T")[0]
  );
  const [adults, setAdults] = useState<number>(bookingPrefill?.adults || 1);

  // New fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [membersDataText, setMembersDataText] = useState(
`Member 1:
1. Full Name:
2. Passport Number:
3. Nationality:
4. Gender:
5. Birthday:
6. Height (cm):
7. Weight (kg):

(Copy the format above for member 2, 3, etc.)
Special/Dietary Requirements:`
  );
  const [orderNote, setOrderNote] = useState("");
  const [paymentOption, setPaymentOption] = useState<"Full" | "Deposit">("Full");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlPackageId = urlParams.get("packageId");
      const urlPackageType = urlParams.get("packageType") as PackageType;
      
      if (urlPackageId) {
        setServiceType("Trekking");
        setSelectedPackageId(urlPackageId);
        if (urlPackageType) setPackageType(urlPackageType);
      } else if (bookingPrefill) {
        if (bookingPrefill.serviceType) setServiceType(bookingPrefill.serviceType);
        if (bookingPrefill.packageId) setSelectedPackageId(bookingPrefill.packageId);
        if (bookingPrefill.packageType) setPackageType(bookingPrefill.packageType);
        if (bookingPrefill.date) setTrekDate(bookingPrefill.date);
        if (bookingPrefill.adults) setAdults(bookingPrefill.adults);
      }
    }
  }, [bookingPrefill]);

  const selectedPkg = packages.find((p) => p.id === selectedPackageId) || packages[0];

  // Calculate pricing
  let basePricePerPerson = 0;
  if (selectedPkg) {
    const highestTier = selectedPkg.pricingMatrix && selectedPkg.pricingMatrix.length > 0 
      ? [...selectedPkg.pricingMatrix].sort((a,b) => b.minPax - a.minPax)[0] 
      : undefined;
    const activeTier = selectedPkg.pricingMatrix?.find(t => adults >= t.minPax && adults <= t.maxPax) || highestTier;

    if (activeTier) {
      if (packageType === "Private") basePricePerPerson = activeTier.pricePrivate;
      else if (packageType === "Standard") basePricePerPerson = activeTier.priceStandard;
      else if (packageType === "Meeting Point") basePricePerPerson = activeTier.priceMeetingPoint;
    } else {
      basePricePerPerson = selectedPkg.priceUSD;
    }
  }

  const subtotal = basePricePerPerson * adults;
  const finalTotalUSD = subtotal;
  const finalTotalIDR = Math.round(finalTotalUSD * 18000);
  
  const depositRequiredUSD = selectedPkg
      ? Math.round((finalTotalUSD * selectedPkg.depositPercentage) / 100 * 100) / 100
      : finalTotalUSD;

  const remainingBalanceUSD = Math.max(0, Math.round((finalTotalUSD - depositRequiredUSD) * 100) / 100);

  const amountToPayUSD = paymentOption === "Full" ? finalTotalUSD : depositRequiredUSD;

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !whatsapp || !arrivalDate || !pickupLocation || !membersDataText) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    const newBookingId = `book-${Date.now().toString().slice(-6)}`;
    const orderNumber = `RH-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    addBooking({
      id: newBookingId,
      orderNumber,
      createdAt: new Date().toISOString(),
      serviceType,
      packageId: selectedPkg?.id,
      packageType,
      packageTitle: selectedPkg?.title || "Trekking Package",
      trekDate,
      participants: {
        adults,
        children: 0,
        extraPorters: 0,
        privateGuide: packageType === "Private",
      },
      customer: {
        fullName,
        email,
        whatsapp,
        pickupLocation,
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
        depositRequiredUSD,
        remainingBalanceUSD,
      },
      paymentStatus: "Pending",
      trackingSource: {
        referrer: sessionStorage.getItem("rh_referrer") || "Direct / Organic",
        returnUrl: sessionStorage.getItem("rh_return_url") || "/",
        utmSource: sessionStorage.getItem("rh_utm_source") || "direct",
        utmMedium: sessionStorage.getItem("rh_utm_medium") || "none",
        utmCampaign: sessionStorage.getItem("rh_utm_campaign") || "none",
        websiteSource: "Secure Checkout",
      },
    });

    // Pass the payment option via query parameter to the payment processing page
    router.push(`/booking/payment/${newBookingId}?paymentOption=${paymentOption.toLowerCase()}`);
  };

  return (
    <div className="bg-[#F4F7F9] min-h-screen py-10 font-sans text-[#122826]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#122826]">Secure Checkout</h1>
          <p className="text-gray-500 text-sm mt-1">Please complete your booking details below.</p>
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
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name *</label>
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
                  placeholder="khaisarrizki420@gmail.com"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                />
                <p className="text-[10px] text-gray-400 mt-1">To change email, sign out and log in again.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">WhatsApp Number *</label>
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="e.g. +628123456789"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Arrival Day (Pick-up Date) *</label>
                <input
                  type="date"
                  required
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Hotel Pickup Location *</label>
                <input
                  type="text"
                  required
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="Name of hotel or address"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">Members data and special request <span className="text-red-500">*</span></label>
                <p className="text-[10px] text-gray-400 mb-2">(the data for registration at national park mount rinjani)</p>
                <textarea
                  required
                  rows={12}
                  value={membersDataText}
                  onChange={(e) => setMembersDataText(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-mono text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Order Note (Optional)</label>
                <textarea
                  rows={3}
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Payment Options */}
            <div className="pt-6">
              <h3 className="text-base font-bold text-[#122826] mb-4">Payment Option</h3>
              <div className="space-y-3">
                <label className={`flex items-start p-4 rounded-lg border cursor-pointer transition ${paymentOption === "Full" ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"}`}>
                  <input
                    type="radio"
                    name="paymentOption"
                    value="Full"
                    checked={paymentOption === "Full"}
                    onChange={() => setPaymentOption("Full")}
                    className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-bold text-gray-900">Pay in Full (100%)</span>
                    <span className="block text-[11px] text-gray-500 mt-1">Pay the total amount (${finalTotalUSD} USD) now.</span>
                  </div>
                </label>

                <label className={`flex items-start p-4 rounded-lg border cursor-pointer transition ${paymentOption === "Deposit" ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"}`}>
                  <input
                    type="radio"
                    name="paymentOption"
                    value="Deposit"
                    checked={paymentOption === "Deposit"}
                    onChange={() => setPaymentOption("Deposit")}
                    className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-bold text-gray-900">Pay Deposit Only (30%)</span>
                    <span className="block text-[11px] text-gray-500 mt-1">Secure your booking now, pay the rest later. (${depositRequiredUSD} USD)</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="pt-6">
              <h3 className="text-base font-bold text-[#122826] mb-4">Payment Method</h3>
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
                Proceed to Payment (${amountToPayUSD} USD)
              </button>
            </div>

          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-4 sticky top-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-base font-bold text-[#122826]">Booking Summary</h3>
              </div>
              <div className="p-5 space-y-4 text-sm text-gray-600">
                <div className="flex justify-between border-b border-gray-100 border-dotted pb-3 gap-4">
                  <span className="text-gray-500 shrink-0">Package</span>
                  <span className="font-semibold text-[#122826] text-right leading-tight">{selectedPkg?.title}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 border-dotted pb-3">
                  <span className="text-gray-500">Trekking Date</span>
                  <span className="font-semibold text-[#122826]">{trekDate}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 border-dotted pb-3">
                  <span className="text-gray-500">Service Type</span>
                  <span className="font-semibold text-[#122826]">{packageType}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 border-dotted pb-3">
                  <span className="text-gray-500">Pricing Mode</span>
                  <span className="font-semibold text-[#122826]">Per Person</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 border-dotted pb-3">
                  <span className="text-gray-500">Participants</span>
                  <span className="font-semibold text-[#122826]">{adults} Adults</span>
                </div>
              </div>
              <div className="p-5 bg-gray-50 flex justify-between items-center">
                <span className="font-bold text-[#122826]">Total Due</span>
                <span className="text-lg font-black text-emerald-500">${amountToPayUSD} USD</span>
              </div>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
