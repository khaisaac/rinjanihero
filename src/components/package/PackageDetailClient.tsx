"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { parseArray } from "@/utils/jsonParser";
import {
  Compass,
  Clock,
  TrendingUp,
  MapPin,
  CheckCircle2,
  XCircle,
  CalendarCheck,
  Users,
  CheckSquare,
  Square,
  HelpCircle,
  Share2,
  Maximize2,
  X,
  Sparkles,
  Award,
  ShieldCheck,
  ArrowRight,
  HeartHandshake,
} from "lucide-react";
import { useCMSStore } from "@/store/cmsStore";
import { TrekkingPackage, PackageType, PricingTier } from "@/types/cms";
// import PackageTypesAccordion from "../shared/PackageTypesAccordion";

interface Props {
  pkg: TrekkingPackage;
  relatedPackages: TrekkingPackage[];
}

export default function PackageDetailClient({ pkg, relatedPackages }: Props) {
  const router = useRouter();
  const { setBookingPrefill } = useCMSStore();
  const [activeTab, setActiveTab] = useState<"itinerary" | "includes" | "gear" | "faq">("itinerary");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [checkedGear, setCheckedGear] = useState<Record<number, boolean>>({});
  const [participants, setParticipants] = useState<number>(2);
  const [packageType, setPackageType] = useState<PackageType>("Standard");
  const [trekDate, setTrekDate] = useState<string>(
    new Date(Date.now() + 86400000 * 10).toISOString().split("T")[0]
  );

  const toggleGear = (idx: number) => {
    setCheckedGear((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Find applicable pricing tier
  const highestTier = pkg.pricingMatrix && pkg.pricingMatrix.length > 0 
    ? [...pkg.pricingMatrix].sort((a,b) => b.minPax - a.minPax)[0] 
    : undefined;
    
  const activeTier = pkg.pricingMatrix?.find(t => participants >= t.minPax && participants <= t.maxPax) || highestTier;

  // Calculate base price
  let basePricePerPerson = pkg.priceUSD;
  if (activeTier) {
    if (packageType === "Private") basePricePerPerson = activeTier.pricePrivate;
    else if (packageType === "Standard") basePricePerPerson = activeTier.priceStandard;
    else if (packageType === "Meeting Point") basePricePerPerson = activeTier.priceMeetingPoint;
  }

  const grandTotal = basePricePerPerson * participants;
  const depositAmount = Math.round((grandTotal * pkg.depositPercentage) / 100);

  const handleProceedBooking = () => {
    setBookingPrefill({
      serviceType: "Trekking",
      packageId: pkg.id,
      packageType,
      route: pkg.route,
      date: trekDate,
      adults: participants,
      returnUrl: `/packages/${pkg.slug}`,
    });
    router.push(`/booking?packageId=${pkg.id}&packageType=${packageType}`);
  };

  return (
    <div className="bg-[#F8FAF9] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Bar */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#18979B]">Home</Link>
          <span>/</span>
          <Link href="/#packages" className="hover:text-[#18979B]">Trekking Packages</Link>
          <span>/</span>
          <span className="text-[#122826] font-semibold line-clamp-1">{pkg.title}</span>
        </nav>

        {/* Title & Header Badges */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#18979B] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {pkg.route} Route
              </span>
              {pkg.isPopular && (
                <span className="bg-[#D4A017] text-[#122826] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  ★ Most Popular Choice
                </span>
              )}
              <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
                All-Inclusive Permits & Insurance
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#122826] tracking-tight">
              {pkg.title}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: pkg.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-200 hover:border-[#18979B] text-gray-700 font-semibold text-xs transition"
            >
              <Share2 className="w-4 h-4 text-[#18979B]" />
              <span>Share Trip</span>
            </button>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-10">
          <div
            onClick={() => setSelectedImage(pkg.coverImage)}
            className="lg:col-span-8 h-[380px] sm:h-[460px] rounded-3xl overflow-hidden relative cursor-pointer group shadow-lg"
          >
            <img
              src={
                pkg.coverImage && !pkg.coverImage.includes("unsplash.com")
                  ? pkg.coverImage
                  : pkg.route === "sembalun"
                  ? "/sembalun.webp"
                  : pkg.route === "senaru"
                  ? "/senaru.webp"
                  : pkg.route === "torean"
                  ? "/torean.webp"
                  : "/hero-rinjani.webp"
              }
              alt={pkg.title}
              onError={(e) => {
                const target = e.currentTarget;
                target.src =
                  pkg.route === "sembalun"
                    ? "/sembalun.webp"
                    : pkg.route === "senaru"
                    ? "/senaru.webp"
                    : pkg.route === "torean"
                    ? "/torean.webp"
                    : "/hero-rinjani.webp";
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-6 text-white">
              <span className="flex items-center gap-1.5 text-xs font-bold bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                <Maximize2 className="w-3.5 h-3.5" /> View Fullscreen Cover
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4 h-full">
            {parseArray(pkg.galleryImages).slice(1, 3).map((img: string, idx: number) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(img)}
                className="h-[180px] sm:h-[220px] rounded-3xl overflow-hidden relative cursor-pointer group shadow-md"
              >
                <img
                  src={img}
                  alt={`${pkg.title} photo ${idx + 2}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Info Strip Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 text-center">
          <div className="flex items-center gap-3 justify-center text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#18979B]/10 text-[#18979B] flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-400 block uppercase font-bold">Duration</span>
              <span className="text-sm font-bold text-[#122826]">{pkg.durationDays} Days / {pkg.durationNights} Nights</span>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#D4A017]/15 text-[#A87E0E] flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-400 block uppercase font-bold">Difficulty</span>
              <span className="text-sm font-bold text-[#122826]">{pkg.difficulty}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#18979B]/10 text-[#18979B] flex items-center justify-center shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-400 block uppercase font-bold">Max Altitude</span>
              <span className="text-sm font-bold text-[#122826]">{pkg.maxAltitude}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#D4A017]/15 text-[#A87E0E] flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-400 block uppercase font-bold">Meeting Point</span>
              <span className="text-sm font-bold text-[#122826] line-clamp-1">{pkg.meetingPoint}</span>
            </div>
          </div>
        </div>

        {/* Main Content + Sticky Booking Box Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Content Column (8 spans) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Overview & Pricing */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-extrabold text-[#122826] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D4A017]" />
                  <span>Expedition Overview</span>
                </h3>
                <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                  {pkg.overview}
                </p>
              </div>

              {pkg.pricingMatrix && pkg.pricingMatrix.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <h3 className="text-xl font-extrabold text-[#122826] flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#18979B]" />
                    <span>Package Pricing (USD / Person)</span>
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                      <thead>
                        <tr className="bg-gray-50 border-y border-gray-200">
                          <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Group Size</th>
                          <th className="px-4 py-3 text-xs font-bold text-[#D4A017] uppercase bg-amber-50/50">Private</th>
                          <th className="px-4 py-3 text-xs font-bold text-[#18979B] uppercase">Standard</th>
                          <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase">Meeting Point</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {pkg.pricingMatrix.map((tier, idx) => (
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
                  
                </div>
              )}
              

            </div>

            {/* Interactive Tabs Navigation */}
            <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-200 flex flex-wrap gap-2">
              {[
                { id: "itinerary", label: "🗓️ Day-by-Day Itinerary" },
                { id: "includes", label: "✅ Includes / Excludes" },
                { id: "gear", label: "🎒 Things To Bring Checklist" },
                { id: "faq", label: "❓ Trekking FAQ" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition ${
                    activeTab === tab.id
                      ? "bg-[#18979B] text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Itinerary */}
            {activeTab === "itinerary" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {parseArray(pkg.itinerary).map((day: any) => (
                  <div key={day.day} className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 w-3 bg-[#18979B]" />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100 mb-4">
                      <h4 className="text-lg sm:text-xl font-extrabold text-[#122826] flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-xl bg-[#18979B] text-white flex items-center justify-center text-sm font-black shrink-0">
                          {day.day}
                        </span>
                        <span>{day.title}</span>
                      </h4>
                      <div className="flex items-center gap-3 text-xs font-semibold text-gray-500">
                        <span className="bg-[#F8FAF9] px-2.5 py-1 rounded-lg border border-gray-200">
                          🏔️ {day.altitude}
                        </span>
                        <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200">
                          🍴 {day.meals}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                      {day.description}
                    </p>

                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017] block">Day {day.day} Highlights:</span>
                      {parseArray(day.highlights).map((hl: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#18979B]" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Includes / Excludes */}
            {activeTab === "includes" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Package Type Switcher */}
                <div className="flex p-1.5 bg-gray-100 rounded-2xl w-full max-w-lg mx-auto">
                  {(["Standard", "Private", "Meeting Point"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setPackageType(type)}
                      className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                        packageType === type
                          ? "bg-white text-[#18979B] shadow-sm scale-105"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Description Rendering */}
                <div 
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 text-gray-600 prose prose-sm max-w-none prose-p:leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: pkg.packageTypes?.[
                      packageType === "Standard" ? "standard" : 
                      packageType === "Private" ? "private" : "meetingPoint"
                    ]?.description || "" 
                  }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-100 space-y-4">
                    <h4 className="text-lg font-bold text-emerald-800 flex items-center gap-2 pb-3 border-b border-emerald-100">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>What is Included ({packageType})</span>
                    </h4>
                    <ul className="space-y-3">
                      {(pkg.packageTypes?.[
                        packageType === "Standard" ? "standard" : 
                        packageType === "Private" ? "private" : "meetingPoint"
                      ]?.includes || []).map((inc: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-red-100 space-y-4">
                    <h4 className="text-lg font-bold text-red-800 flex items-center gap-2 pb-3 border-b border-red-100">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span>What is Excluded ({packageType})</span>
                    </h4>
                    <ul className="space-y-3">
                      {(pkg.packageTypes?.[
                        packageType === "Standard" ? "standard" : 
                        packageType === "Private" ? "private" : "meetingPoint"
                      ]?.excludes || []).map((exc: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                          <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <span>{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Things To Bring Checklist */}
            {activeTab === "gear" && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 space-y-6 animate-in fade-in duration-200">
                <div>
                  <h4 className="text-xl font-bold text-[#122826] flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-[#18979B]" />
                    <span>Interactive Gear Preparation Checklist</span>
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Check off items as you pack into your daypack. Heavy camping tents, sleeping bags, and meals are carried by our porters!
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {parseArray(pkg.thingsToBring).map((item: string, idx: number) => {
                    const checked = !!checkedGear[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleGear(idx)}
                        className={`p-4 rounded-2xl border transition cursor-pointer flex items-center gap-3 select-none ${
                          checked
                            ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                            : "bg-[#F8FAF9] border-gray-200 hover:border-[#18979B] text-gray-700"
                        }`}
                      >
                        {checked ? (
                          <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400 shrink-0" />
                        )}
                        <span className={`text-sm font-semibold ${checked ? "line-through opacity-80" : ""}`}>
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 4: FAQ */}
            {activeTab === "faq" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {parseArray(pkg.faq).map((f: any, i: number) => (
                  <div key={i} className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 space-y-2">
                    <h5 className="text-base font-bold text-[#122826] flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#18979B] shrink-0" />
                      <span>{f.question}</span>
                    </h5>
                    <p className="text-sm text-gray-600 leading-relaxed pl-6">
                      {f.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Related Packages Carousel/Cards */}
            {relatedPackages.length > 0 && (
              <div className="pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-extrabold text-[#122826] mb-6">
                  Recommended Similar Expeditions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {relatedPackages.map((rel) => (
                    <div
                      key={rel.id}
                      className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition border border-gray-100 flex flex-col justify-between group"
                    >
                      <div className="h-44 relative overflow-hidden">
                        <img
                          src={
                            rel.coverImage && !rel.coverImage.includes("unsplash.com")
                              ? rel.coverImage
                              : rel.route === "sembalun"
                              ? "/sembalun.webp"
                              : rel.route === "senaru"
                              ? "/senaru.webp"
                              : rel.route === "torean"
                              ? "/torean.webp"
                              : "/hero-rinjani.webp"
                          }
                          alt={rel.title}
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.src =
                              rel.route === "sembalun"
                                ? "/sembalun.webp"
                                : rel.route === "senaru"
                                ? "/senaru.webp"
                                : rel.route === "torean"
                                ? "/torean.webp"
                                : "/hero-rinjani.webp";
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-[#122826]/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                          {rel.route} Route
                        </span>
                      </div>
                      <div className="p-5 space-y-2">
                        <Link href={`/packages/${rel.slug}`}>
                          <h4 className="font-bold text-[#122826] group-hover:text-[#18979B] transition line-clamp-1">
                            {rel.title}
                          </h4>
                        </Link>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{rel.durationDays} Days / {rel.durationNights} Nights</span>
                          <span className="font-extrabold text-[#122826] text-base">${rel.priceUSD}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sticky Booking Summary Box Column (4 spans) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="glass-dark p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 text-white space-y-6">
              <div className="pb-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#D4A017] uppercase font-extrabold tracking-wider block">Total Price ({participants} pax)</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-3xl font-black text-white">${grandTotal}</span>
                    <span className="text-xs text-gray-300 font-medium">USD</span>
                  </div>
                </div>
                <div className="text-right flex flex-col gap-1 items-end">
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-400/30">
                    Deposit {pkg.depositPercentage}%
                  </span>
                  <span className="text-xs text-gray-400">${basePricePerPerson}/person</span>
                </div>
              </div>

              {/* Booking Customization Controls */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                    Target Trekking Date
                  </label>
                  <input
                    type="date"
                    value={trekDate}
                    onChange={(e) => setTrekDate(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#18979B] cursor-pointer"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                    <span>Number of Trekkers</span>
                    <span className="text-[#D4A017] lowercase font-normal">Discount for 4+</span>
                  </label>
                  <div className="flex items-center justify-between bg-white/10 border border-white/20 rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-2.5 text-sm font-semibold">
                      <Users className="w-4 h-4 text-[#18979B]" />
                      <span>{participants} {participants === 1 ? "Person" : "People"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setParticipants(Math.max(1, participants - 1))}
                        className="w-8 h-8 rounded-lg bg-white/15 hover:bg-[#18979B] font-bold transition flex items-center justify-center text-sm"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => setParticipants(participants + 1)}
                        className="w-8 h-8 rounded-lg bg-white/15 hover:bg-[#18979B] font-bold transition flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Package Type Selector */}
                {pkg.pricingMatrix && pkg.pricingMatrix.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                      Select Package Type
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {["Private", "Standard", "Meeting Point"].map((ptype) => (
                        <div
                          key={ptype}
                          onClick={() => setPackageType(ptype as PackageType)}
                          className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                            packageType === ptype
                              ? ptype === "Private" ? "bg-[#D4A017]/20 border-[#D4A017] text-white" : "bg-[#18979B]/20 border-[#18979B] text-white"
                              : "bg-white/5 border-white/10 text-gray-300 hover:border-white/30"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {packageType === ptype ? (
                              <CheckSquare className={`w-5 h-5 shrink-0 ${ptype === "Private" ? "text-[#D4A017]" : "text-[#18979B]"}`} />
                            ) : (
                              <Square className="w-5 h-5 text-gray-400 shrink-0" />
                            )}
                            <div>
                              <h5 className={`text-xs font-bold ${packageType === ptype ? 'text-white' : 'text-gray-300'}`}>{ptype} Package</h5>
                            </div>
                          </div>
                          {activeTier && (
                            <span className={`text-xs font-extrabold ${ptype === "Private" ? "text-[#D4A017]" : "text-white"}`}>
                              ${ptype === "Private" ? activeTier.pricePrivate : ptype === "Standard" ? activeTier.priceStandard : activeTier.priceMeetingPoint} / pax
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between text-gray-300">
                  <span>Base ({participants} × ${basePricePerPerson}):</span>
                  <span className="font-bold text-white">${grandTotal}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-sm font-extrabold text-white">
                  <span>Grand Total:</span>
                  <span className="text-[#D4A017]">${grandTotal} USD</span>
                </div>
                <div className="flex items-center justify-between text-emerald-400 font-semibold pt-1">
                  <span>Required Deposit ({pkg.depositPercentage}%):</span>
                  <span>${depositAmount} USD</span>
                </div>
              </div>

              {/* Proceed to Booking CTA */}
              <button
                onClick={handleProceedBooking}
                className="w-full bg-gradient-to-r from-[#D4A017] via-[#F3C644] to-[#B8860B] hover:from-[#F3C644] hover:to-[#D4A017] text-[#122826] font-extrabold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-base uppercase tracking-wider"
              >
                <CalendarCheck className="w-5 h-5" />
                <span>Proceed to Booking</span>
              </button>

              <div className="text-center text-[11px] text-gray-300 space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Instant E-Ticket Barcode & Insurance Included</span>
                </div>
                <p>Remaining balance payable online or upon arrival in cash.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative max-w-5xl w-full bg-[#122826] rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <div className="p-4 bg-[#122826] flex items-center justify-between border-b border-white/10 text-white">
              <span className="font-bold text-sm">{pkg.title}</span>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 text-gray-400 hover:text-white bg-white/10 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[80vh] flex items-center justify-center bg-black overflow-hidden">
              <img src={selectedImage} alt={pkg.title} className="max-w-full max-h-[80vh] object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
