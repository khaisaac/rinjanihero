"use client";

import Link from "next/link";
import { Compass, CheckCircle2, ArrowRight, Sunset } from "lucide-react";
import { useCMSStore } from "@/store/cmsStore";
import { parseArray } from "@/utils/jsonParser";

export default function SenaruRouteSection() {
  const { routes, packages } = useCMSStore();
  const senaruRoute = (Array.isArray(routes) ? routes : []).find((r) => r.id === "senaru");
  const senaruPackages = (Array.isArray(packages) ? packages : []).filter((p) => p.route === "senaru");

  if (!senaruRoute) return null;

  return (
    <section className="py-20 lg:py-28 bg-[#F8FAF9] relative overflow-hidden border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content (6 spans) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#18979B]/10 text-[#18979B] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sunset className="w-4 h-4" />
              <span>Senaru Route Focus</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#122826] tracking-tight leading-tight">
              {senaruRoute.name} — <span className="text-[#18979B]">{senaruRoute.subtitle}</span>
            </h2>

            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              {senaruRoute.description}
            </p>

            {/* Highlights Grid */}
            <div className="space-y-3 pt-2">
              {parseArray(senaruRoute.highlights).map((item: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#18979B]/15 text-[#18979B] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            {/* Packages available on this route */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Available Senaru Packages:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {senaruPackages.map((pkg) => (
                  <Link
                    key={pkg.id}
                    href={`/packages/${pkg.slug}`}
                    className="p-3.5 rounded-2xl bg-white hover:bg-[#18979B]/10 border border-gray-200 hover:border-[#18979B] shadow-sm transition flex items-center justify-between group"
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

          {/* Right Visual Image (6 spans) */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
              <img
                src={senaruRoute.coverImage && !senaruRoute.coverImage.includes("unsplash.com") ? senaruRoute.coverImage : "/senaru.webp"}
                alt="Senaru Rainforest and Crater Rim Sunset"
                className="w-full h-[440px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#122826] via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs bg-[#18979B] text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-wider block w-max mb-2">
                  🌲 Shaded Tropical Ascent
                </span>
                <h3 className="text-2xl font-black text-white">Senaru Crater Rim Sunset (2,641m)</h3>
                <p className="text-xs text-gray-300 mt-1">
                  Enjoy golden hour looking directly down into Segara Anak Lake and the smoking cone of Gunung Baru Jari.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
