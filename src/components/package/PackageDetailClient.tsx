"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { parseArray, parseJson } from "@/utils/jsonParser";
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
  Calendar,
  CreditCard,
  Check
} from "lucide-react";
import { useCMSStore } from "@/store/cmsStore";
import { TrekkingPackage, PackageType, PricingTier } from "@/types/cms";

interface Props {
  pkg: TrekkingPackage;
  relatedPackages: TrekkingPackage[];
}

export default function PackageDetailClient({ pkg, relatedPackages }: Props) {
  const router = useRouter();
  const { setBookingPrefill } = useCMSStore();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [checkedGear, setCheckedGear] = useState<Record<number, boolean>>({});
  const [participants, setParticipants] = useState<number>(2); // Default to 2 for better UI
  const [packageType, setPackageType] = useState<PackageType>("Standard");
  const [trekDate, setTrekDate] = useState<string>(
    new Date(Date.now() + 86400000 * 10).toISOString().split("T")[0]
  );

  const toggleGear = (idx: number) => {
    setCheckedGear((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const pricingMatrix = parseArray<PricingTier>(pkg.pricingMatrix);
  const parsedPackageTypes = parseJson<any>(pkg.packageTypes, {});

  const highestTier = pricingMatrix && pricingMatrix.length > 0 
    ? [...pricingMatrix].sort((a,b) => b.minPax - a.minPax)[0] 
    : undefined;
    
  const activeTier = pricingMatrix?.find(t => participants >= t.minPax && participants <= t.maxPax) || highestTier;

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

  const getPriceForType = (type: string) => {
      if (!activeTier) return pkg.priceUSD;
      if (type === "Private") return activeTier.pricePrivate;
      if (type === "Standard") return activeTier.priceStandard;
      return activeTier.priceMeetingPoint;
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-[#18979B] text-gray-700 font-semibold text-sm transition"
            >
              <Share2 className="w-4 h-4 text-[#18979B]" />
              <span>Share Trip</span>
            </button>
          </div>
        </div>

        {/* Grid Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Gallery Section */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 h-[320px] sm:h-[420px]">
              <div
                onClick={() => setSelectedImage(pkg.coverImage)}
                className="sm:col-span-8 h-full rounded-2xl sm:rounded-l-3xl sm:rounded-r-none overflow-hidden relative cursor-pointer group shadow-sm"
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
                    const target = e.currentTarget as HTMLImageElement;
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

              <div className="hidden sm:grid sm:col-span-4 grid-cols-2 grid-rows-2 gap-2 h-full">
                {parseArray(pkg.galleryImages).slice(1, 5).map((img: string, idx: number) => {
                  let roundedClass = "";
                  if (idx === 1) roundedClass = "rounded-tr-3xl";
                  if (idx === 3) roundedClass = "rounded-br-3xl";
                  
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`h-full overflow-hidden relative cursor-pointer group shadow-sm ${roundedClass}`}
                    >
                      <img
                        src={img}
                        alt={`${pkg.title} photo ${idx + 2}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Overview */}
            <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line px-2">
              {pkg.overview}
            </div>

            {/* Pricing Information Table */}
            {pricingMatrix && pricingMatrix.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-extrabold text-[#122826] px-2">Pricing Information</h3>
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Group Size</th>
                        <th className="px-4 py-3 text-xs font-bold text-[#D4A017] uppercase tracking-wider bg-amber-50/50 rounded-t-xl">Private</th>
                        <th className="px-4 py-3 text-xs font-bold text-[#18979B] uppercase tracking-wider">Standard</th>
                        <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Meeting Point</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {pricingMatrix.map((tier, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition">
                          <td className="px-4 py-4 text-sm font-bold text-[#122826]">{tier.groupSize}</td>
                          <td className="px-4 py-4 text-sm font-extrabold text-[#D4A017] bg-amber-50/30">${tier.pricePrivate}</td>
                          <td className="px-4 py-4 text-sm font-bold text-[#18979B]">${tier.priceStandard}</td>
                          <td className="px-4 py-4 text-sm font-semibold text-gray-600">${tier.priceMeetingPoint}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Quick Info Strip Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-2">
                <Clock className="w-6 h-6 text-[#18979B]" />
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-bold">Duration</span>
                  <span className="text-sm font-bold text-[#122826]">{pkg.durationDays}D / {pkg.durationNights}N</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-2">
                <TrendingUp className="w-6 h-6 text-[#A87E0E]" />
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-bold">Difficulty</span>
                  <span className="text-sm font-bold text-[#122826]">{pkg.difficulty}</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-2">
                <Compass className="w-6 h-6 text-[#18979B]" />
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-bold">Max Altitude</span>
                  <span className="text-sm font-bold text-[#122826]">{pkg.maxAltitude}</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-2">
                <MapPin className="w-6 h-6 text-[#A87E0E]" />
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-bold">Meeting Point</span>
                  <span className="text-sm font-bold text-[#122826] line-clamp-1">{pkg.meetingPoint}</span>
                </div>
              </div>
            </div>

            {/* About this activity */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
              <h3 className="text-xl font-extrabold text-[#122826]">About this activity</h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="mt-1">
                    <CheckCircle2 className="w-6 h-6 text-[#18979B]" />
                  </div>
                  <div>
                    <div className="font-bold text-base text-[#122826]">Free cancellation</div>
                    <div className="text-sm text-gray-500 mt-1">Cancel up to 24 hours in advance for a full refund</div>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1">
                    <CreditCard className="w-6 h-6 text-[#18979B]" />
                  </div>
                  <div>
                    <div className="font-bold text-base text-[#122826]">Reserve now & pay later</div>
                    <div className="text-sm text-gray-500 mt-1">Keep your travel plans flexible — book your spot and pay nothing today.</div>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1">
                    <Calendar className="w-6 h-6 text-[#18979B]" />
                  </div>
                  <div>
                    <div className="font-bold text-base text-[#122826]">Duration {pkg.durationDays} Days</div>
                    <div className="text-sm text-gray-500 mt-1">Check availability to see starting times.</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Package Options */}
            <div className="space-y-4 pt-4">
              <h3 className="text-2xl font-extrabold text-[#122826] px-2 mb-6">Package Options</h3>
              
              {(["Private", "Standard", "Meeting Point"] as const).map((type) => {
                const isSelected = packageType === type;
                const details = parsedPackageTypes?.[
                  type === "Standard" ? "standard" : 
                  type === "Private" ? "private" : "meetingPoint"
                ];

                return (
                  <div 
                    key={type} 
                    className={`border rounded-3xl overflow-hidden transition-all duration-300 ${
                      isSelected 
                        ? 'border-[#18979B] shadow-md ring-1 ring-[#18979B]/20 bg-white' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div 
                      onClick={() => setPackageType(type)}
                      className={`p-6 cursor-pointer flex items-center justify-between ${isSelected ? 'bg-[#18979B]/5' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'border-[#18979B] bg-[#18979B]' : 'border-gray-300'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <h4 className="text-lg font-bold text-[#122826]">{type} Package</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-extrabold text-[#18979B]">${getPriceForType(type)}</div>
                        <div className="text-xs text-gray-500">per person</div>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="px-6 pb-8 pt-4 border-t border-gray-100 bg-white animate-in slide-in-from-top-2 fade-in duration-300">
                        {details?.description && (
                          <div 
                            className="text-gray-600 prose prose-sm max-w-none prose-p:leading-relaxed mb-6"
                            dangerouslySetInnerHTML={{ __html: details.description }}
                          />
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h5 className="font-bold text-[#122826] flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              What's included
                            </h5>
                            <ul className="space-y-2.5">
                              {(details?.includes || []).map((inc: string, i: number) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                  <span>{inc}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-4">
                            <h5 className="font-bold text-[#122826] flex items-center gap-2">
                              <XCircle className="w-4 h-4 text-red-500" />
                              What's not included
                            </h5>
                            <ul className="space-y-2.5">
                              {(details?.excludes || []).map((exc: string, i: number) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                                  <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                  <span>{exc}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Itinerary Section */}
            <div className="space-y-6 pt-10 border-t border-gray-100">
              <h3 className="text-2xl font-extrabold text-[#122826] px-2 mb-6">🗓️ Day-by-Day Itinerary</h3>
              {parseArray(pkg.itinerary).map((day: any) => (
                <div key={day.day} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 bottom-0 w-2 bg-[#18979B]" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100 mb-4 ml-2">
                    <h4 className="text-lg sm:text-xl font-extrabold text-[#122826] flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-[#18979B]/10 text-[#18979B] flex items-center justify-center text-sm font-black shrink-0">
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

                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed ml-2">
                    {day.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 ml-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">Day {day.day} Highlights</span>
                    {parseArray(day.highlights).map((hl: string, i: number) => (
                      <div key={i} className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#18979B]" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Things To Bring Checklist Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6 mt-10">
              <div>
                <h4 className="text-xl font-bold text-[#122826] flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-[#18979B]" />
                  <span>Preparation Checklist</span>
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Check off items as you pack. Heavy camping tents, sleeping bags, and meals are carried by our porters!
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

            {/* FAQ Section */}
            <div className="space-y-4 pt-10 border-t border-gray-100">
              <h3 className="text-2xl font-extrabold text-[#122826] px-2 mb-6">❓ Frequently Asked Questions (FAQ)</h3>
              {parseArray(pkg.faq).map((f: any, i: number) => (
                <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-3">
                  <h5 className="text-base font-bold text-[#122826] flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-[#18979B] shrink-0 mt-0.5" />
                    <span>{f.question}</span>
                  </h5>
                  <p className="text-sm text-gray-600 leading-relaxed pl-8">
                    {f.answer}
                  </p>
                </div>
              ))}
            </div>

            {/* Related Packages Carousel/Cards */}
            {relatedPackages.length > 0 && (
              <div className="pt-10 border-t border-gray-200">
                <h3 className="text-2xl font-extrabold text-[#122826] px-2 mb-6">
                  Related Tour
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {relatedPackages.map((rel) => (
                    <div
                      key={rel.id}
                      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition border border-gray-100 flex flex-col justify-between group"
                    >
                      <div className="h-48 relative overflow-hidden">
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
                            const target = e.currentTarget as HTMLImageElement;
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
                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#122826] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                          {rel.route} Route
                        </span>
                      </div>
                      <div className="p-5 space-y-3">
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{rel.durationDays} Days / {rel.durationNights} Nights</span>
                        </div>
                        <Link href={`/packages/${rel.slug}`}>
                          <h4 className="font-bold text-[#122826] group-hover:text-[#18979B] transition line-clamp-2 text-lg">
                            {rel.title}
                          </h4>
                        </Link>
                        <div className="pt-3 flex items-center justify-between border-t border-gray-100 mt-2">
                          <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">From</span>
                          <span className="font-black text-[#18979B] text-xl">${rel.priceUSD}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN (STICKY WIDGET) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden">
              <div className="p-6 sm:p-8 space-y-6">
                
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Price</span>
                  <div className="text-3xl font-black text-[#122826]">${basePricePerPerson}</div>
                  <span className="text-sm text-gray-500">per person</span>
                </div>

                <div className="space-y-4">
                  {/* Package Type Selection (Syncs with Left Column) */}
                  <div>
                    <label className="block text-xs font-bold text-[#122826] mb-2 uppercase tracking-wider">
                      Select Package Type
                    </label>
                    <select 
                      value={packageType}
                      onChange={(e) => setPackageType(e.target.value as PackageType)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#122826] font-semibold focus:outline-none focus:ring-2 focus:ring-[#18979B]/20 focus:border-[#18979B] appearance-none"
                    >
                      <option value="Standard">Standard Package</option>
                      <option value="Private">Private Package</option>
                      <option value="Meeting Point">Meeting Point Package</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#122826] mb-2 uppercase tracking-wider">
                      Target Trekking Date
                    </label>
                    <input
                      type="date"
                      value={trekDate}
                      onChange={(e) => setTrekDate(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#122826] font-semibold focus:outline-none focus:ring-2 focus:ring-[#18979B]/20 focus:border-[#18979B]"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#122826] mb-2 uppercase tracking-wider">
                      Number of Trekkers
                    </label>
                    <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
                      <div className="flex items-center gap-2.5 text-sm font-semibold">
                        <Users className="w-4 h-4 text-[#18979B]" />
                        <span>{participants} {participants === 1 ? "Adult" : "Adults"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setParticipants(Math.max(1, participants - 1))}
                          className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:border-[#18979B] hover:text-[#18979B] text-gray-600 font-bold transition flex items-center justify-center shadow-sm"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => setParticipants(participants + 1)}
                          className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:border-[#18979B] hover:text-[#18979B] text-gray-600 font-bold transition flex items-center justify-center shadow-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <div className="flex items-center justify-between text-sm font-bold text-[#122826]">
                    <span>Total ({participants} pax)</span>
                    <span className="text-lg text-[#18979B]">${grandTotal}</span>
                  </div>

                  <button
                    onClick={handleProceedBooking}
                    className="w-full bg-[#18979B] hover:bg-[#122826] text-white font-extrabold py-4 px-6 rounded-xl shadow-lg shadow-[#18979B]/20 hover:shadow-xl transition flex items-center justify-center gap-2 text-base tracking-wide"
                  >
                    Book Now
                  </button>
                </div>
                
              </div>
              
              <div className="bg-gray-50 p-6 border-t border-gray-100 text-sm text-gray-600 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#18979B] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-[#122826] block">Free cancellation</span>
                    <span className="text-xs">Cancel up to 24 hours in advance for a full refund</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard className="w-4 h-4 text-[#18979B] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-[#122826] block">Reserve now & pay later</span>
                    <span className="text-xs">Keep your travel plans flexible</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative max-w-5xl w-full bg-transparent rounded-3xl overflow-hidden flex flex-col items-center">
            <div className="w-full flex justify-end p-4 absolute top-0 right-0 z-10">
              <button
                onClick={() => setSelectedImage(null)}
                className="p-3 bg-black/50 hover:bg-white text-white hover:text-black rounded-full transition backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img src={selectedImage} alt={pkg.title} className="max-w-full max-h-[85vh] object-contain rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
}
