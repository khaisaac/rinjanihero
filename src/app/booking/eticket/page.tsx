"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, MapPin, Calendar, Check, X, ShieldCheck, ChevronRight } from "lucide-react";
import { useCMSStore } from "@/store/cmsStore";

const GATES = [
  { id: "Sembalun", label: "Sembalun", image: "/sembalun.webp" },
  { id: "Torean - Senange", label: "Torean - Senange", image: "/torean.webp" },
  { id: "Senaru", label: "Senaru", image: "/senaru.webp" }
];

export default function ETicketBookingPage() {
  const router = useRouter();
  const { addBooking } = useCMSStore();

  const [entranceGate, setEntranceGate] = useState<string>("");
  const [exitGate, setExitGate] = useState<string>("");
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [adults, setAdults] = useState<number>(1);
  const [nationality, setNationality] = useState<"WNA" | "WNI">("WNA");
  const [insurance, setInsurance] = useState<"Regular" | "Premium">("Regular");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [membersDataText, setMembersDataText] = useState("");

  const [showEntranceModal, setShowEntranceModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Logic to determine minimum days
  const getMinDays = (entrance: string, exit: string): number => {
    if (!entrance || !exit) return 2;
    if (entrance === "Sembalun" && exit === "Sembalun") return 2;
    if (entrance === "Torean - Senange" && exit === "Sembalun") return 3;
    if (entrance === "Torean - Senange" && exit === "Torean - Senange") return 3;
    if (entrance === "Torean - Senange" && exit === "Senaru") return 3;
    if (entrance === "Sembalun" && exit === "Senaru") return 3;
    if (entrance === "Senaru" && exit === "Senaru") return 2;
    if (entrance === "Senaru" && exit === "Sembalun") return 3;
    if (entrance === "Sembalun" && exit === "Torean - Senange") return 3;
    if (entrance === "Senaru" && exit === "Torean - Senange") return 3;
    return 2;
  };

  const minDays = getMinDays(entranceGate, exitGate);

  // When checkIn or gate changes, adjust checkOut to meet minimum days
  useEffect(() => {
    if (checkIn) {
      const minCheckOutDate = new Date(checkIn);
      minCheckOutDate.setDate(minCheckOutDate.getDate() + (minDays - 1));
      
      if (!checkOut || new Date(checkOut) < minCheckOutDate) {
        setCheckOut(minCheckOutDate.toISOString().split('T')[0]);
      }
    }
  }, [checkIn, entranceGate, exitGate, minDays]);

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const startD = new Date(start);
    const endD = new Date(end);
    const diffTime = endD.getTime() - startD.getTime();
    if (diffTime < 0) return 0;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays + 1; // e.g. checkin 1st, checkout 2nd = 2 days
  };

  const durationDays = calculateDays(checkIn, checkOut) || 0;

  const WNA_FEE = 250000;
  const WNI_FEE = 10000;
  const REGULAR_INSURANCE = 10000;
  const PREMIUM_INSURANCE = 290000;

  const dailyFee = nationality === "WNA" ? WNA_FEE : WNI_FEE;
  const insuranceFee = insurance === "Regular" ? REGULAR_INSURANCE : PREMIUM_INSURANCE;
  
  const ticketTotal = dailyFee * durationDays * adults;
  const insuranceTotal = insuranceFee * adults;
  const finalTotalIDR = ticketTotal + insuranceTotal;
  const finalTotalUSD = Math.round(finalTotalIDR / 15000);

  const handleSubmitBooking = () => {
    if (!entranceGate || !exitGate) {
      setErrorMsg("Please select Entrance and Exit Gates.");
      return;
    }
    if (!checkIn || !checkOut) {
      setErrorMsg("Please select Check In and Check Out dates.");
      return;
    }
    if (durationDays < minDays) {
      setErrorMsg(`Minimum duration for ${entranceGate} to ${exitGate} is ${minDays} days.`);
      return;
    }
    if (!fullName || !whatsapp || !membersDataText) {
      setErrorMsg("Please fill in your Contact Details & Participant Data.");
      return;
    }

    const newBookingId = `book-${Date.now().toString().slice(-6)}`;
    const orderNumber = `RH-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    addBooking({
      id: newBookingId,
      orderNumber,
      createdAt: new Date().toISOString(),
      serviceType: "E-Ticket",
      packageId: "eticket-custom",
      packageTitle: `E-Rinjani Entrance (${entranceGate} to ${exitGate})`,
      trekDate: checkIn,
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
        pickupLocation: "N/A",
        membersDataText,
        arrivalDate: checkIn,
        orderNote: `Nationality: ${nationality}, Insurance: ${insurance}`,
      },
      pricing: {
        basePricePerPerson: Math.round((dailyFee * durationDays + insuranceFee) / 15000),
        subtotal: finalTotalUSD,
        extrasTotal: 0,
        discountAmount: 0,
        totalUSD: finalTotalUSD,
        totalIDR: finalTotalIDR,
        depositRequiredUSD: finalTotalUSD,
        remainingBalanceUSD: 0,
      },
      paymentStatus: "Pending",
      trackingSource: {
        referrer: "Direct",
        returnUrl: "/",
        utmSource: "direct",
        utmMedium: "none",
        utmCampaign: "none",
        websiteSource: "E-Ticket App",
      },
    });

    router.push(`/booking/payment/${newBookingId}?paymentOption=full`);
  };

  const getBannerImage = () => {
    if (entranceGate === "Senaru") return "/senaru.webp";
    if (entranceGate === "Torean - Senange") return "/torean.webp";
    return "/sembalun.webp"; // default
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-16 font-sans">
      {/* Header */}
      <header className="bg-[#1C3631] text-white flex items-center justify-between px-4 py-3 sticky top-0 z-40">
        <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Image src="/taman.png" alt="Logo" width={24} height={24} className="object-contain" />
          <h1 className="font-bold text-lg">Booking Ticket</h1>
        </div>
        <div className="w-9" /> {/* Spacer */}
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 lg:mt-8">
        
        {errorMsg && (
          <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl text-sm font-semibold border border-red-200">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-video relative bg-gray-200 border border-gray-100">
              <Image src={getBannerImage()} alt="Entrance Gate" fill className="object-cover" />
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-[#1C3631] mb-3">e-Rinjani Entrance Tickets</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Secure your limited official Mt. Rinjani National Park entrance tickets first! Ensure flexible dates and instant confirmation before commencing your trek.
                <br /><br />
                1. 2 days senaru Crater rim please chose Senaru - Senaru<br />
                2. 2 days trek to summit please chose Sembalun - sembalun<br />
                3. Torean cross routes require minimum 3 days.
              </p>
              
              <a href="#" className="text-blue-600 text-xs font-semibold underline mb-6 inline-block">
                Learn the difference between Premium and Regular Insurance here
              </a>

              <h3 className="font-bold text-lg text-[#1C3631] mb-4">About This Ticket</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex gap-3 text-sm text-gray-600 items-start">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Instant Booking:</strong> Avoid queues and secure your entry pass ahead of your climb.</span>
                </li>
                <li className="flex gap-3 text-sm text-gray-600 items-start">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Medical Insurance Included:</strong> Covers basic search, rescue, and health care within the national park.</span>
                </li>
                <li className="flex gap-3 text-sm text-gray-600 items-start">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Official Registration:</strong> Issued and verified directly through the Rinjani National Park registry.</span>
                </li>
                <li className="flex gap-3 text-sm text-gray-600 items-start">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Flexible Routes:</strong> Valid for Sembalun, Senaru, and Torean trekking trails.</span>
                </li>
                <li className="flex gap-3 text-sm text-gray-600 items-start">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>No Refundable:</strong> because directly to the government account but you can reschedule if available min a day before trek.</span>
                </li>
              </ul>

              <hr className="border-gray-100 mb-6" />

              <h3 className="font-bold text-lg text-[#1C3631] mb-4">What's Included</h3>
              <ul className="space-y-3">
                <li className="flex gap-3 text-sm text-gray-600 items-center">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Official Mt. Rinjani National Park Entrance Pass</span>
                </li>
                <li className="flex gap-3 text-sm text-gray-600 items-center">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Customized Entrance and Exit Gate route registry</span>
                </li>
                <li className="flex gap-3 text-sm text-gray-600 items-center">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Trekking Health & Search and Rescue (SAR) Insurance</span>
                </li>
                <li className="flex gap-3 text-sm text-gray-600 items-center">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>24/7 client support for e-Rinjani processing</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Entrance Gate */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3 text-[#1C3631] font-bold">
                <MapPin className="w-5 h-5 text-emerald-500" />
                <span>Entrance Gate</span>
              </div>
              <button 
                onClick={() => setShowEntranceModal(true)}
                className={`w-full text-left p-4 rounded-xl border border-dashed transition ${
                  entranceGate ? "border-emerald-300 bg-emerald-50" : "border-gray-300 hover:bg-gray-50 text-gray-500"
                }`}
              >
                {entranceGate ? (
                  <div className="font-bold text-emerald-800">{entranceGate}</div>
                ) : (
                  <span className="text-sm">+ Select Entrance Gate</span>
                )}
              </button>
            </div>

            {/* Exit Gate */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3 text-[#1C3631] font-bold">
                <MapPin className="w-5 h-5 text-red-500" />
                <span>Exit Gate</span>
              </div>
              <button 
                onClick={() => setShowExitModal(true)}
                className={`w-full text-left p-4 rounded-xl border border-dashed transition ${
                  exitGate ? "border-red-300 bg-red-50" : "border-gray-300 hover:bg-gray-50 text-gray-500"
                }`}
              >
                {exitGate ? (
                  <div className="font-bold text-red-800">{exitGate}</div>
                ) : (
                  <span className="text-sm">+ Select Exit Gate</span>
                )}
              </button>
            </div>

            {/* Trekking Date */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4 text-[#1C3631] font-bold">
                <Calendar className="w-5 h-5" />
                <span>Trekking Date</span>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-lg p-3 mb-4 flex items-center gap-2">
                <span>Duration: {durationDays > 0 ? `${durationDays} Days` : "Pick dates"} (Minimum {minDays} Days)</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Check In</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm font-semibold focus:outline-none focus:border-[#1C3631]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Check Out</label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn ? new Date(new Date(checkIn).setDate(new Date(checkIn).getDate() + minDays - 1)).toISOString().split('T')[0] : undefined}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm font-semibold focus:outline-none focus:border-[#1C3631]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-sm font-bold text-gray-700">Number of Trekkers</span>
                <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
                  <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-200 rounded">-</button>
                  <span className="font-bold text-sm w-4 text-center">{adults}</span>
                  <button type="button" onClick={() => setAdults(adults + 1)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-200 rounded">+</button>
                </div>
              </div>
            </div>

            {/* Nationality */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#1C3631] mb-3 text-sm">Nationality / Kewarganegaraan</h3>
              <div className="flex gap-3 mb-3">
                <button
                  onClick={() => setNationality("WNA")}
                  className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold transition border ${
                    nationality === "WNA" ? "bg-emerald-50 border-emerald-500 text-emerald-800" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Foreigner (WNA)
                </button>
                <button
                  onClick={() => setNationality("WNI")}
                  className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold transition border ${
                    nationality === "WNI" ? "bg-emerald-50 border-emerald-500 text-emerald-800" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Indonesian (WNI)
                </button>
              </div>
              <div className="bg-gray-50 text-[11px] text-gray-500 p-2.5 rounded-lg border border-gray-100">
                {nationality === "WNA" ? "Foreign National Fee: Rp 250,000 / day / person." : "Indonesian National Fee: Rp 10,000 / day / person."}
              </div>
            </div>

            {/* Insurance Option */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
              <h3 className="font-bold text-[#1C3631] mb-2 text-sm">Insurance Option</h3>
              
              <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                insurance === "Regular" ? "bg-emerald-50/50 border-emerald-400" : "bg-white border-gray-200"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${insurance === "Regular" ? "border-emerald-500 bg-emerald-500" : "border-gray-300"}`}>
                    {insurance === "Regular" && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Regular Insurance</div>
                    <div className="text-xs text-gray-500 font-semibold mt-0.5">Rp {REGULAR_INSURANCE.toLocaleString()} / person</div>
                  </div>
                </div>
              </label>

              <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                insurance === "Premium" ? "bg-emerald-50/50 border-emerald-400" : "bg-white border-gray-200"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${insurance === "Premium" ? "border-emerald-500 bg-emerald-500" : "border-gray-300"}`}>
                    {insurance === "Premium" && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 flex items-center gap-1">Premium Insurance <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /></div>
                    <div className="text-xs text-gray-500 font-semibold mt-0.5">Rp {PREMIUM_INSURANCE.toLocaleString()} / person</div>
                  </div>
                </div>
              </label>
            </div>

            {/* Contact & Participants Data */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#1C3631] mb-4 text-sm">Contact & Participants Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Lead Booker Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm font-semibold focus:outline-none focus:border-[#1C3631]"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">WhatsApp Number *</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm font-semibold focus:outline-none focus:border-[#1C3631]"
                    placeholder="+628123456789"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Passports & Data ({adults} Pax) *</label>
                  <textarea
                    rows={6}
                    value={membersDataText}
                    onChange={(e) => setMembersDataText(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-mono focus:outline-none focus:border-[#1C3631]"
                    placeholder={`Member 1:\nName:\nPassport/KTP:\nNationality:\nGender:\nBirthday:\n\n(Repeat for all participants)`}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitBooking}
              className="w-full bg-[#1C3631] hover:bg-[#132622] text-white font-bold py-4 rounded-2xl transition text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#1C3631]/20 mt-4"
            >
              <span>Book Now • Rp {finalTotalIDR.toLocaleString()}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-2">Prices include all National Park fees and insurances.</p>

          </div>
        </div>
      </div>

      {/* Modals for Gates */}
      {showEntranceModal && (
        <GateSelectModal
          title="Select Entrance Gate"
          onClose={() => setShowEntranceModal(false)}
          onSelect={(gate) => { setEntranceGate(gate); setShowEntranceModal(false); }}
        />
      )}
      {showExitModal && (
        <GateSelectModal
          title="Select Exit Gate"
          onClose={() => setShowExitModal(false)}
          onSelect={(gate) => { setExitGate(gate); setShowExitModal(false); }}
        />
      )}

    </div>
  );
}

function GateSelectModal({ title, onClose, onSelect }: { title: string, onClose: () => void, onSelect: (gate: string) => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative">
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          <h3 className="font-bold text-[#1C3631] text-lg">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          {GATES.map((gate) => (
            <button
              key={gate.id}
              onClick={() => onSelect(gate.id)}
              className="w-full relative h-20 rounded-2xl overflow-hidden group border-2 border-transparent hover:border-emerald-500 transition-all"
            >
              <Image src={gate.image} alt={gate.label} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              <span className="absolute inset-0 flex items-center justify-center text-white font-extrabold text-lg shadow-black drop-shadow-md">
                {gate.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
