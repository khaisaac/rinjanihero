"use client";

import Link from "next/link";
import { Mountain, CheckCircle2, TrendingUp, ArrowRight, ShieldCheck } from "lucide-react";
import { useCMSStore } from "@/store/cmsStore";
import { parseArray } from "@/utils/jsonParser";

export default function SembalunRouteSection() {
  const { routes, packages } = useCMSStore();
  const sembalunRoute = (Array.isArray(routes) ? routes : []).find((r) => r.id === "sembalun");
  const sembalunPackages = (Array.isArray(packages) ? packages : []).filter((p) => p.route === "sembalun");

  if (!sembalunRoute) return null;

  return (
    <section id="routes" className="py-20 lg:py-28 bg-white relative overflow-hidden border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Visual Map / Photo (6 spans) */}
          <div className="lg:col-span-6 order-2 lg:order-1 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
              <img
                src={sembalunRoute.coverImage && !sembalunRoute.coverImage.includes("unsplash.com") ? sembalunRoute.coverImage : "/sembalun.webp"}
                alt="Sembalun Route Savannah & Summit Ridge"
                className="w-full h-[440px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#122826] via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs bg-[#D4A017] text-[#122826] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider block w-max mb-2">
                  ⚡ Primary Summit Ascent Gate
                </span>
                <h3 className="text-2xl font-black text-white">Plawangan Sembalun Crater Rim (2,639m)</h3>
                <p className="text-xs text-gray-300 mt-1">
                  Camp under the Milky Way on the high rim before starting your 2:00 AM push along the volcanic ridge to 3,726m.
                </p>
              </div>
            </div>

            {/* Floating Altitude Card */}
            <div className="absolute -bottom-6 -right-6 bg-[#122826] text-white p-5 rounded-3xl shadow-2xl border border-[#18979B]/40 hidden sm:block max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#18979B] flex items-center justify-center text-white shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#D4A017] uppercase">Elevation Profile</h4>
                  <p className="text-sm font-black">1,100m → 3,726m Summit</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content & Packages (6 spans) */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#18979B]/10 text-[#18979B] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Mountain className="w-4 h-4" />
              <span>Sembalun Route Focus</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#122826] tracking-tight leading-tight">
              {sembalunRoute.name} — <span className="text-[#18979B]">{sembalunRoute.subtitle}</span>
            </h2>

            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              {sembalunRoute.description}
            </p>

            {/* Highlights Grid */}
            <div className="space-y-3 pt-2">
              {parseArray(sembalunRoute.highlights).map((item: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#18979B]/15 text-[#18979B] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            {/* Packages available on this route */}
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Available Sembalun Packages:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sembalunPackages.map((pkg) => (
                  <Link
                    key={pkg.id}
                    href={`/packages/${pkg.slug}`}
                    className="p-3.5 rounded-2xl bg-[#F8FAF9] hover:bg-[#18979B]/10 border border-gray-200 hover:border-[#18979B] transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-bold text-[#122826] group-hover:text-[#18979B] transition line-clamp-1">
                        {pkg.title}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        {pkg.durationDays}D/{pkg.durationNights}N • <span className="text-[#122826] font-bold">${pkg.priceUSD}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#18979B] group-hover:translate-x-1 transition" />
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
