"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  Clock,
  TrendingUp,
  MapPin,
  CheckCircle2,
  CalendarCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useCMSStore } from "@/store/cmsStore";
import { TrekkingPackage } from "@/types/cms";

export default function PopularPackages() {
  const router = useRouter();
  const { packages, setBookingPrefill } = useCMSStore();
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredPackages =
    activeTab === "all"
      ? packages
      : packages.filter((p) => p.route === activeTab);

  const handleQuickBook = (pkg: TrekkingPackage) => {
    setBookingPrefill({
      serviceType: "Trekking",
      packageId: pkg.id,
      route: pkg.route,
      adults: 2,
      returnUrl: `/#packages`,
    });
    router.push("/booking");
  };

  return (
    <section id="packages" className="py-20 lg:py-28 bg-[#F8FAF9] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Tabs */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#18979B]/10 text-[#18979B] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Popular Trekking Packages</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#122826] tracking-tight">
            Handcrafted Mount Rinjani Expeditions
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Whether you want a fast 2-day summit attack, a relaxing sunset crater rim camp, or our signature 3D2N Segara Anak Lake & Torean waterfall loop—we have the perfect itinerary.
          </p>

          {/* Interactive Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: "all", label: "🔥 All Packages" },
              { id: "sembalun", label: "🗻 Sembalun Route" },
              { id: "senaru", label: "🌳 Senaru Route" },
              { id: "torean", label: "🏞️ Torean Route" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-[#18979B] text-white shadow-md transform scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Packages Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col group transform hover:-translate-y-1.5"
            >
              {/* Image Header */}
              <div className="relative h-60 overflow-hidden">
                <img
                  src={pkg.coverImage}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="bg-[#122826]/90 text-white backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/20">
                    {pkg.route} Route
                  </span>
                  {pkg.isPopular && (
                    <span className="bg-[#D4A017] text-[#122826] font-extrabold px-3 py-1 rounded-full text-xs uppercase tracking-wider shadow">
                      ★ Most Popular
                    </span>
                  )}
                </div>

                {/* Bottom Image Info */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <TrendingUp className="w-4 h-4 text-[#D4A017]" />
                    <span>{pkg.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold bg-black/40 px-2.5 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5 text-[#18979B]" />
                    <span>{pkg.durationDays}D / {pkg.durationNights}N</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-[#18979B] font-bold uppercase tracking-wider mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Max Altitude: {pkg.maxAltitude}</span>
                  </div>

                  <Link href={`/packages/${pkg.slug}`}>
                    <h3 className="text-xl font-extrabold text-[#122826] group-hover:text-[#18979B] transition line-clamp-2">
                      {pkg.title}
                    </h3>
                  </Link>

                  <p className="text-gray-600 text-xs sm:text-sm mt-2 line-clamp-3 leading-relaxed">
                    {pkg.shortDescription}
                  </p>

                  {/* Highlights pills */}
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    {pkg.includes.slice(0, 3).map((inc, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & Action Bottom Bar */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-gray-400 font-bold block">All-Inclusive Price</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-[#122826]">${pkg.priceUSD}</span>
                      <span className="text-xs text-gray-500 font-medium">/ person</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/packages/${pkg.slug}`}
                      className="px-3.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#122826] font-bold text-xs transition flex items-center gap-1"
                    >
                      <span>Detail</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => handleQuickBook(pkg)}
                      className="px-4 py-2.5 rounded-xl bg-[#18979B] hover:bg-[#13797C] text-white font-bold text-xs shadow hover:shadow-md transition flex items-center gap-1.5"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <span>Book Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
