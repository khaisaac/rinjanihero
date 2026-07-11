"use client";

import Link from "next/link";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { useCMSStore } from "@/store/cmsStore";
import { parseArray } from "@/utils/jsonParser";

export default function ToreanRouteSection() {
  const { routes, packages } = useCMSStore();
  const toreanRoute = routes.find((r) => r.id === "torean");
  const toreanPackages = packages.filter((p) => p.route === "torean");

  if (!toreanRoute) return null;

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Visual Image (6 spans) */}
          <div className="lg:col-span-6 order-2 lg:order-1 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
              <img
                src={toreanRoute.coverImage}
                alt="Torean Jurassic Park River Valley & Waterfall"
                className="w-full h-[440px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#122826] via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs bg-[#D4A017] text-[#122826] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider block w-max mb-2">
                  🦕 Lombok&apos;s Jurassic Park
                </span>
                <h3 className="text-2xl font-black text-white">Penimbungan Waterfall & Thermal Springs</h3>
                <p className="text-xs text-gray-300 mt-1">
                  Descend alongside 100-meter vertical canyon walls and natural sulfur baths through the breathtaking Kokok Putih valley.
                </p>
              </div>
            </div>
          </div>

          {/* Right Content (6 spans) */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#D4A017]/15 text-[#A87E0E] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Torean Route Focus</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#122826] tracking-tight leading-tight">
              {toreanRoute.name} — <span className="text-[#D4A017]">{toreanRoute.subtitle}</span>
            </h2>

            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              {toreanRoute.description}
            </p>

            {/* Highlights Grid */}
            <div className="space-y-3 pt-2">
              {parseArray(toreanRoute.highlights).map((item: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#D4A017]/20 text-[#A87E0E] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            {/* Packages available on this route */}
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Available Torean Packages:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {toreanPackages.map((pkg) => (
                  <Link
                    key={pkg.id}
                    href={`/packages/${pkg.slug}`}
                    className="p-3.5 rounded-2xl bg-[#F8FAF9] hover:bg-[#D4A017]/10 border border-gray-200 hover:border-[#D4A017] transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-bold text-[#122826] group-hover:text-[#A87E0E] transition line-clamp-1">
                        {pkg.title}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        {pkg.durationDays}D/{pkg.durationNights}N • <span className="text-[#122826] font-bold">${pkg.priceUSD}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#D4A017] group-hover:translate-x-1 transition" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
