"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarCheck,
  Compass,
  Truck,
  Ticket,
  Users,
  Tag,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Info,
  Sparkles,
  MapPin,
  Clock,
  HeartHandshake,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useCMSStore } from "@/store/cmsStore";
import { ServiceType, Voucher, PackageType } from "@/types/cms";
import PackageTypesAccordion from "@/components/shared/PackageTypesAccordion";

export default function BookingPage() {
  const router = useRouter();
  const { packages, transportation, eTickets, bookingPrefill, addBooking, validateAndApplyVoucher } = useCMSStore();

  const [serviceType, setServiceType] = useState<ServiceType>(bookingPrefill?.serviceType || "Trekking");
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    bookingPrefill?.packageId || packages[0]?.id || ""
  );
  const [packageType, setPackageType] = useState<PackageType>(bookingPrefill?.packageType || "Standard");
  const [selectedTransportId, setSelectedTransportId] = useState<string>(transportation[0]?.id || "");
  const [selectedETicketId, setSelectedETicketId] = useState<string>(eTickets[0]?.id || "");

  const [trekDate, setTrekDate] = useState<string>(
    bookingPrefill?.date || new Date(Date.now() + 86400000 * 10).toISOString().split("T")[0]
  );
  const [adults, setAdults] = useState<number>(bookingPrefill?.adults || 2);
  const children = 0;
  const extraPorters = 0;

  // Customer details
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [nationality, setNationality] = useState("United States");
  const [passportNumber, setPassportNumber] = useState("");
  const [birthday, setBirthday] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");

  const [additionalTravelers, setAdditionalTravelers] = useState<
    { fullName: string; nationality: string; passportNumber: string; birthday: string; height: string; weight: string; dietaryNotes: string }[]
  >([]);

  useEffect(() => {
    if (adults > 1) {
      setAdditionalTravelers(prev => {
        const count = adults - 1;
        if (prev.length === count) return prev;
        if (prev.length < count) {
          return [...prev, ...Array(count - prev.length).fill({ fullName: "", nationality: "United States", passportNumber: "", birthday: "", height: "", weight: "", dietaryNotes: "" })];
        }
        return prev.slice(0, count);
      });
    } else {
      setAdditionalTravelers([]);
    }
  }, [adults]);

  // Voucher
  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [voucherMessage, setVoucherMessage] = useState("");
  const [voucherDiscountUSD, setVoucherDiscountUSD] = useState(0);

  // Terms acceptance
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlPackageId = urlParams.get("packageId");
      const urlPackageType = urlParams.get("packageType") as PackageType;
      const urlServiceType = urlParams.get("serviceType");
      const urlTransportId = urlParams.get("transportId");
      
      if (urlPackageId) {
        setServiceType("Trekking");
        setSelectedPackageId(urlPackageId);
        if (urlPackageType) setPackageType(urlPackageType);
      } else if (urlServiceType === "Transportation" && urlTransportId) {
        setServiceType("Transportation");
        setSelectedTransportId(urlTransportId);
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
  const selectedTrans = transportation.find((t) => t.id === selectedTransportId) || transportation[0];
  const selectedTicket = eTickets.find((e) => e.id === selectedETicketId) || eTickets[0];

  // Calculate pricing
  let basePricePerPerson = 0;
  let subtotal = 0;
  let extrasTotal = 0;

  if (serviceType === "Trekking" && selectedPkg) {
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

    subtotal = basePricePerPerson * adults;
  } else if (serviceType === "Transportation" && selectedTrans) {
    basePricePerPerson = selectedTrans.priceUSD;
    subtotal = selectedTrans.priceUSD; // per vehicle
  } else if (serviceType === "E-Ticket" && selectedTicket) {
    basePricePerPerson = selectedTicket.priceUSD;
    subtotal = selectedTicket.priceUSD * adults;
  }

  const subtotalBeforeVoucher = subtotal + extrasTotal;
  const finalTotalUSD = Math.max(0, Math.round((subtotalBeforeVoucher - voucherDiscountUSD) * 100) / 100);
  const finalTotalIDR = Math.round(finalTotalUSD * 18000);

  const depositRequiredUSD =
    serviceType === "Trekking" && selectedPkg
      ? Math.round((finalTotalUSD * selectedPkg.depositPercentage) / 100 * 100) / 100
      : finalTotalUSD; // Transport and ticket full confirmation or custom

  const remainingBalanceUSD = Math.max(0, Math.round((finalTotalUSD - depositRequiredUSD) * 100) / 100);

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherInput.trim()) return;
    const res = validateAndApplyVoucher(voucherInput, subtotalBeforeVoucher);
    if (res.valid && res.voucher) {
      setAppliedVoucher(res.voucher);
      setVoucherDiscountUSD(res.discountUSD);
      setVoucherMessage(res.message);
      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#18979B", "#D4A017", "#10B981"],
      });
    } else {
      setAppliedVoucher(null);
      setVoucherDiscountUSD(0);
      setVoucherMessage(res.message);
    }
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !whatsapp) {
      setErrorMsg("Please fill in your Full Name, Email, and WhatsApp number.");
      return;
    }
    if (!acceptedTerms) {
      setErrorMsg("Please accept the Terms & Conditions to proceed.");
      return;
    }

    const newBookingId = `book-${Date.now().toString().slice(-6)}`;
    const orderNumber = `RH-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const trackingSource = {
      referrer: sessionStorage.getItem("rh_referrer") || "Direct / Organic",
      returnUrl: sessionStorage.getItem("rh_return_url") || "/",
      utmSource: sessionStorage.getItem("rh_utm_source") || "direct",
      utmMedium: sessionStorage.getItem("rh_utm_medium") || "none",
      utmCampaign: sessionStorage.getItem("rh_utm_campaign") || "none",
      websiteSource: "Online Booking Portal",
    };

    addBooking({
      id: newBookingId,
      orderNumber,
      createdAt: new Date().toISOString(),
      serviceType,
      packageId: serviceType === "Trekking" ? selectedPkg?.id : undefined,
      packageType: serviceType === "Trekking" ? packageType : undefined,
      packageTitle:
        serviceType === "Trekking"
          ? selectedPkg?.title || "Trekking Package"
          : serviceType === "Transportation"
          ? selectedTrans?.destination || "Lombok Transfer"
          : selectedTicket?.title || "E-Rinjani Ticket",
      trekDate,
      participants: {
        adults,
        children,
        extraPorters,
        privateGuide: packageType === "Private",
        additionalTravelers,
      },
      customer: {
        fullName,
        email,
        phone: phone || whatsapp,
        whatsapp,
        nationality,
        passportNumber: passportNumber || undefined,
        birthday: birthday || undefined,
        height: height || undefined,
        weight: weight || undefined,
        dietaryNotes: dietaryNotes || "None",
        pickupLocation: pickupLocation || "TBD / Direct Senaru Check-in",
      },
      pricing: {
        basePricePerPerson,
        subtotal: subtotalBeforeVoucher,
        extrasTotal,
        voucherCode: appliedVoucher?.code,
        discountAmount: voucherDiscountUSD,
        totalUSD: finalTotalUSD,
        totalIDR: finalTotalIDR,
        depositRequiredUSD,
        remainingBalanceUSD,
      },
      paymentStatus: "Pending",
      trackingSource,
    });

    router.push(`/booking/payment/${newBookingId}`);
  };

  return (
    <div className="bg-[#F8FAF9] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Indicator */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#18979B] bg-[#18979B]/10 px-3.5 py-1.5 rounded-full block w-max mx-auto mb-3">
            Official Expedition Reservation
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#122826]">
            Step 1 of 2: Customize & Reserve
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">
            Choose your package, enter participant details, and lock in your Rinjani permits.
          </p>
        </div>

        {/* Service Type Selector Pills */}
        <div className="bg-white rounded-3xl p-3 shadow-md border border-gray-200 mb-8 max-w-2xl mx-auto grid grid-cols-2 gap-2">
          {[
            { id: "Trekking", label: "🗻 Trekking Package" },
            { id: "Transportation", label: "🚐 Lombok Transfer" },
            // { id: "E-Ticket", label: "🎟️ E-Rinjani Ticket" },
          ].map((srv) => (
            <button
              key={srv.id}
              onClick={() => setServiceType(srv.id as ServiceType)}
              className={`py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 ${
                serviceType === srv.id
                  ? "bg-[#18979B] text-white shadow-md"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span>{srv.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Main Form Column (8 spans) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Section 1: Package / Service Selection */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 space-y-6">
              <h3 className="text-xl font-extrabold text-[#122826] flex items-center gap-2 pb-3 border-b border-gray-100">
                <Compass className="w-5 h-5 text-[#18979B]" />
                <span>1. {serviceType} Selection</span>
              </h3>

              {serviceType === "Trekking" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Select Trekking Itinerary:
                    </label>
                    <select
                      value={selectedPackageId}
                      onChange={(e) => setSelectedPackageId(e.target.value)}
                      className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3.5 text-sm font-bold text-[#122826] focus:outline-none focus:border-[#18979B]"
                    >
                      {packages.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} — ${p.priceUSD} USD / person ({p.durationDays}D/{p.durationNights}N)
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedPkg && (
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-[#18979B]/10 to-transparent border border-[#18979B]/30 space-y-3">
                      <div className="flex items-center justify-between text-sm font-bold text-[#122826]">
                        <span>Route: {selectedPkg.route.toUpperCase()}</span>
                        <span className="text-[#18979B]">Difficulty: {selectedPkg.difficulty}</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{selectedPkg.shortDescription}</p>
                      <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold text-emerald-800">
                        <span className="bg-emerald-100 px-2.5 py-1 rounded-lg">✓ Official E-Ticket Included</span>
                        <span className="bg-emerald-100 px-2.5 py-1 rounded-lg">✓ Guide & Porters Included</span>
                        <span className="bg-emerald-100 px-2.5 py-1 rounded-lg">✓ 1-Night Pre-Trek Hotel</span>
                      </div>
                    </div>
                  )}

                  {selectedPkg && selectedPkg.pricingMatrix && selectedPkg.pricingMatrix.length > 0 && (
                    <div className="pt-4 border-t border-gray-100 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Select Package Type:
                        </label>
                        <select
                          value={packageType}
                          onChange={(e) => setPackageType(e.target.value as PackageType)}
                          className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3.5 text-sm font-bold text-[#122826] focus:outline-none focus:border-[#18979B]"
                        >
                          <option value="Private">Private Package</option>
                          <option value="Standard">Standard Package</option>
                          <option value="Meeting Point">Meeting Point Package</option>
                        </select>
                      </div>

                      <div className="overflow-x-auto border border-gray-200 rounded-xl">
                        <table className="w-full text-left border-collapse min-w-[400px]">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Group Size</th>
                              <th className="px-4 py-3 text-xs font-bold text-[#D4A017] uppercase bg-amber-50/50">Private</th>
                              <th className="px-4 py-3 text-xs font-bold text-[#18979B] uppercase">Standard</th>
                              <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase">Meeting Point</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {selectedPkg.pricingMatrix.map((tier, idx) => (
                              <tr key={idx} className="hover:bg-gray-50 transition">
                                <td className="px-4 py-3 text-sm font-bold text-[#122826]">{tier.groupSize}</td>
                                <td className="px-4 py-3 text-sm font-extrabold text-[#D4A017] bg-amber-50/30">${tier.pricePrivate}</td>
                                <td className="px-4 py-3 text-sm font-bold text-[#18979B]">${tier.priceStandard}</td>
                                <td className="px-4 py-3 text-sm font-semibold text-gray-600">${tier.priceMeetingPoint}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Package Types Explanation */}
                      <PackageTypesAccordion pkgTypes={selectedPkg.packageTypes} />
                    </div>
                  )}
                </div>
              )}

              {serviceType === "Transportation" && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Select Transfer Route:
                  </label>
                  <select
                    value={selectedTransportId}
                    onChange={(e) => setSelectedTransportId(e.target.value)}
                    className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3.5 text-sm font-bold text-[#122826] focus:outline-none focus:border-[#18979B]"
                  >
                    {transportation.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.destination} — ${t.priceUSD} USD / vehicle ({t.capacity})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {serviceType === "E-Ticket" && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Select Official National Park Pass:
                  </label>
                  <select
                    value={selectedETicketId}
                    onChange={(e) => setSelectedETicketId(e.target.value)}
                    className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3.5 text-sm font-bold text-[#122826] focus:outline-none focus:border-[#18979B]"
                  >
                    {eTickets.map((et) => (
                      <option key={et.id} value={et.id}>
                        {et.title} — ${et.priceUSD} USD / person
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Section 2: Lead Traveler & Contact Info */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 space-y-6">
              <h3 className="text-xl font-extrabold text-[#122826] flex items-center gap-2 pb-3 border-b border-gray-100">
                <Users className="w-5 h-5 text-[#18979B]" />
                <span>2. Lead Traveler Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Full Name (As on Passport) *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Harrison"
                    className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3.5 text-sm text-[#122826] placeholder-gray-400 focus:outline-none focus:border-[#18979B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Email Address (For Invoice & E-Ticket) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@gmail.com"
                    className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3.5 text-sm text-[#122826] placeholder-gray-400 focus:outline-none focus:border-[#18979B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    WhatsApp Number (With Country Code) *
                  </label>
                  <input
                    type="text"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+1 415 889 2031"
                    className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3.5 text-sm text-[#122826] placeholder-gray-400 focus:outline-none focus:border-[#18979B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Nationality / Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="United States"
                    className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3.5 text-sm text-[#122826] placeholder-gray-400 focus:outline-none focus:border-[#18979B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Passport Number (For Park Permit Registration)
                  </label>
                  <input
                    type="text"
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    placeholder="C8291039 (Or send via WhatsApp later)"
                    className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3.5 text-sm text-[#122826] placeholder-gray-400 focus:outline-none focus:border-[#18979B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Hotel Pickup / Arrival Location & Time
                  </label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="e.g. Senggigi Beach Hotel at 06:00 AM or Airport"
                    className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3.5 text-sm text-[#122826] placeholder-gray-400 focus:outline-none focus:border-[#18979B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3.5 text-sm text-[#122826] placeholder-gray-400 focus:outline-none focus:border-[#18979B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Height (cm) *
                  </label>
                  <input
                    type="number"
                    required
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 175"
                    className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3.5 text-sm text-[#122826] placeholder-gray-400 focus:outline-none focus:border-[#18979B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    required
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 70"
                    className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3.5 text-sm text-[#122826] placeholder-gray-400 focus:outline-none focus:border-[#18979B]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Dietary Notes / Allergies (Vegetarian, Vegan, Gluten-Free, No Peanuts, etc.)
                  </label>
                  <input
                    type="text"
                    value={dietaryNotes}
                    onChange={(e) => setDietaryNotes(e.target.value)}
                    placeholder="Our chef will prepare customized gourmet meals according to your requirements."
                    className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3.5 text-sm text-[#122826] placeholder-gray-400 focus:outline-none focus:border-[#18979B]"
                  />
                </div>
              </div>
            </div>

            {/* Additional Travelers Loop */}
            {additionalTravelers.map((traveler, index) => (
              <div key={index} className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 space-y-6">
                <h3 className="text-xl font-extrabold text-[#122826] flex items-center gap-2 pb-3 border-b border-gray-100">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span>Traveler {index + 2} Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Full Name (As on Passport) *
                    </label>
                    <input
                      type="text"
                      required
                      value={traveler.fullName}
                      onChange={(e) => {
                        const newTravelers = [...additionalTravelers];
                        newTravelers[index] = { ...newTravelers[index], fullName: e.target.value };
                        setAdditionalTravelers(newTravelers);
                      }}
                      placeholder="e.g. Sarah Connor"
                      className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3.5 text-sm text-[#122826] placeholder-gray-400 focus:outline-none focus:border-[#18979B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Nationality / Country *
                    </label>
                    <input
                      type="text"
                      required
                      value={traveler.nationality}
                      onChange={(e) => {
                        const newTravelers = [...additionalTravelers];
                        newTravelers[index] = { ...newTravelers[index], nationality: e.target.value };
                        setAdditionalTravelers(newTravelers);
                      }}
                      placeholder="United States"
                      className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3.5 text-sm text-[#122826] placeholder-gray-400 focus:outline-none focus:border-[#18979B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Passport Number
                    </label>
                    <input
                      type="text"
                      value={traveler.passportNumber}
                      onChange={(e) => {
                        const newTravelers = [...additionalTravelers];
                        newTravelers[index] = { ...newTravelers[index], passportNumber: e.target.value };
                        setAdditionalTravelers(newTravelers);
                      }}
                      placeholder="(Or send via WhatsApp later)"
                      className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3.5 text-sm text-[#122826] placeholder-gray-400 focus:outline-none focus:border-[#18979B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      required
                      value={traveler.birthday}
                      onChange={(e) => {
                        const newTravelers = [...additionalTravelers];
                        newTravelers[index] = { ...newTravelers[index], birthday: e.target.value };
                        setAdditionalTravelers(newTravelers);
                      }}
                      className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3.5 text-sm text-[#122826] placeholder-gray-400 focus:outline-none focus:border-[#18979B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Height (cm) *
                    </label>
                    <input
                      type="number"
                      required
                      value={traveler.height}
                      onChange={(e) => {
                        const newTravelers = [...additionalTravelers];
                        newTravelers[index] = { ...newTravelers[index], height: e.target.value };
                        setAdditionalTravelers(newTravelers);
                      }}
                      placeholder="e.g. 175"
                      className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3.5 text-sm text-[#122826] placeholder-gray-400 focus:outline-none focus:border-[#18979B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Weight (kg) *
                    </label>
                    <input
                      type="number"
                      required
                      value={traveler.weight}
                      onChange={(e) => {
                        const newTravelers = [...additionalTravelers];
                        newTravelers[index] = { ...newTravelers[index], weight: e.target.value };
                        setAdditionalTravelers(newTravelers);
                      }}
                      placeholder="e.g. 70"
                      className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3.5 text-sm text-[#122826] placeholder-gray-400 focus:outline-none focus:border-[#18979B]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Dietary Notes
                    </label>
                    <input
                      type="text"
                      value={traveler.dietaryNotes}
                      onChange={(e) => {
                        const newTravelers = [...additionalTravelers];
                        newTravelers[index] = { ...newTravelers[index], dietaryNotes: e.target.value };
                        setAdditionalTravelers(newTravelers);
                      }}
                      placeholder="Optional"
                      className="w-full bg-[#F8FAF9] border border-gray-300 rounded-2xl px-4 py-3.5 text-sm text-[#122826] placeholder-gray-400 focus:outline-none focus:border-[#18979B]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Sticky Order Summary Box Column (4 spans) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="glass-dark p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 text-white space-y-6">
              <div className="pb-4 border-b border-white/10">
                <span className="text-[10px] text-[#D4A017] uppercase font-extrabold tracking-wider block">Order Summary</span>
                <h3 className="text-xl font-black text-white mt-1 line-clamp-1">
                  {serviceType === "Trekking"
                    ? selectedPkg?.title
                    : serviceType === "Transportation"
                    ? selectedTrans?.destination
                    : selectedTicket?.title}
                </h3>
                {serviceType === "Trekking" && (
                  <p className="text-xs font-bold text-[#D4A017] mt-1 uppercase tracking-wider">
                    {packageType} Package
                  </p>
                )}
              </div>

              {/* Form inside Order Summary */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2">
                    Target Trek / Service Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={trekDate}
                    onChange={(e) => setTrekDate(e.target.value)}
                    className="w-full bg-[#1A2E2C] border border-white/20 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#18979B] placeholder-gray-400"
                    min={new Date().toISOString().split("T")[0]}
                    style={{ colorScheme: 'dark' }}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2">
                    Adult Trekkers (12+ yrs) *
                  </label>
                  <div className="flex items-center justify-between bg-[#1A2E2C] border border-white/20 rounded-xl px-4 py-2">
                    <span className="text-sm font-bold text-white">{adults} Adults</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdults(adults + 1)}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-gray-300">
                  <span>Base Price ({adults} Adults):</span>
                  <span className="font-bold text-white">${basePricePerPerson * adults}</span>
                </div>

                {voucherDiscountUSD > 0 && (
                  <div className="flex items-center justify-between text-emerald-400 font-bold bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/30">
                    <span>Promo Discount ({appliedVoucher?.code}):</span>
                    <span>-${voucherDiscountUSD} USD</span>
                  </div>
                )}

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-base font-black text-white">
                  <span>Total Amount:</span>
                  <span className="text-[#D4A017]">${finalTotalUSD} USD</span>
                </div>

                <div className="flex items-center justify-between text-emerald-400 font-semibold pt-1 text-sm bg-black/40 p-3 rounded-2xl border border-white/10">
                  <div>
                    <span className="block">Required Deposit Now:</span>
                    <span className="text-[10px] text-gray-400">({selectedPkg?.depositPercentage || 100}% required to lock permit)</span>
                  </div>
                  <span className="text-lg font-black text-emerald-400">${depositRequiredUSD} USD</span>
                </div>

                {remainingBalanceUSD > 0 && (
                  <div className="flex items-center justify-between text-gray-300 text-[11px] pt-1 px-1">
                    <span>Remaining Due Upon Arrival:</span>
                    <span className="font-bold text-white">${remainingBalanceUSD} USD ({Math.round(remainingBalanceUSD * 18000).toLocaleString()} IDR)</span>
                  </div>
                )}
              </div>

              {/* Voucher Input Box */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                  Promo / Voucher Code
                </label>
                <form onSubmit={handleApplyVoucher} className="flex gap-2">
                  <input
                    type="text"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    placeholder="e.g. HERO2026 or SUMMIT30"
                    className="flex-grow bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-gray-400 focus:outline-none focus:border-[#18979B]"
                  />
                  <button
                    type="submit"
                    className="bg-[#18979B] hover:bg-[#13797C] text-white font-bold px-3 py-2 rounded-xl text-xs transition shrink-0"
                  >
                    Apply
                  </button>
                </form>
                {voucherMessage && (
                  <p className={`text-[11px] font-semibold ${appliedVoucher ? "text-emerald-400" : "text-amber-400"}`}>
                    {voucherMessage}
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 text-xs text-gray-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-[#18979B] rounded border-gray-300 focus:ring-[#18979B]"
                  />
                  <span>
                    I agree to the <strong className="text-white">Rinjani Hero Terms & Safety Policy</strong>. I confirm my passport info is accurate for park registration.
                  </span>
                </label>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/20 border border-red-500 text-red-200 text-xs font-semibold">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Submit CTA */}
              <button
                onClick={handleSubmitBooking}
                className="w-full bg-gradient-to-r from-[#D4A017] via-[#F3C644] to-[#B8860B] hover:from-[#F3C644] hover:to-[#D4A017] text-[#122826] font-extrabold py-4 px-6 rounded-2xl shadow-2xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-base uppercase tracking-wider"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="text-center text-[11px] text-gray-300">
                <span className="flex items-center justify-center gap-1.5 text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>DOKU Payment Gateway Protection</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
