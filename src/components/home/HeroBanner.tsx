"use client";

import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Award,
  TrendingUp,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";
import { useCMSStore } from "@/store/cmsStore";

export default function HeroBanner() {
  const router = useRouter();
  const { settings } = useCMSStore();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center text-white overflow-hidden py-20 lg:py-28">
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('${settings.heroBackgroundImage}')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#122826]/90 via-[#122826]/75 to-[#122826]/95 backdrop-blur-[2px]" />

      {/* Decorative Floating Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#18979B]/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#D4A017]/25 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        <div className="space-y-7 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#18979B]/30 border border-[#18979B]/50 px-5 py-2 rounded-full text-xs sm:text-sm font-semibold text-[#D4A017] backdrop-blur-md shadow-sm animate-fade-in mx-auto">
            <Sparkles className="w-4 h-4 text-[#D4A017]" />
            <span>{settings.heroBadgeText}</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
            {settings.heroHeading.split("Mount Rinjani")[0]}
            <span className="text-gradient-gold block sm:inline">Mount Rinjani</span>
            {settings.heroHeading.split("Mount Rinjani")[1]}
          </h1>

          {/* Subheading */}
          <p className="text-gray-200 text-base sm:text-xl leading-relaxed max-w-2xl mx-auto drop-shadow">
            {settings.heroSubheading}
          </p>

          {/* Quick Feature Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/15">
              <ShieldCheck className="w-4 h-4 text-[#18979B] shrink-0" />
              <span className="font-medium">100% Safety & First Aid</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/15">
              <Award className="w-4 h-4 text-[#D4A017] shrink-0" />
              <span className="font-medium">TripAdvisor 5-Star</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/15">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-medium">Official Park E-Tickets</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-5">
            <button
              onClick={() => router.push("/#packages")}
              className="bg-gradient-to-r from-[#18979B] to-[#13797C] hover:from-[#13797C] hover:to-[#0E5B5D] text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2.5 text-base sm:text-lg"
            >
              <span>Explore Trekking Packages</span>
              <TrendingUp className="w-5 h-5" />
            </button>

            <a
              href={`https://wa.me/${settings.contactWhatsapp.replace(/[^0-9]/g, "")}?text=Hello%20Rinjani%20Hero,%20I%20want%20to%20plan%20a%20trekking%20trip.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#D4A017] text-white font-bold px-7 py-4 rounded-2xl transition flex items-center gap-2.5 text-base sm:text-lg backdrop-blur-md"
            >
              <HeartHandshake className="w-5 h-5 text-[#D4A017]" />
              <span>Custom Trip Planner</span>
            </a>
          </div>
        </div>

        {/* Bottom Stats Counter Bar */}
        <div className="mt-20 pt-10 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:border-[#18979B] transition">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#D4A017] tracking-tight">10+ Years</div>
            <div className="text-xs sm:text-sm text-gray-300 mt-1.5 font-medium">Local Operator Since 2013</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:border-[#18979B] transition">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#18979B] tracking-tight">1,000+</div>
            <div className="text-xs sm:text-sm text-gray-300 mt-1.5 font-medium">Happy Trekkers Every Year</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:border-[#18979B] transition">
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">100%</div>
            <div className="text-xs sm:text-sm text-gray-300 mt-1.5 font-medium">Summit Safety Record</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:border-[#18979B] transition">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#D4A017] tracking-tight flex items-center justify-center gap-1.5">
              <span>4.9 / 5</span>
              <Award className="w-6 h-6 text-[#D4A017]" />
            </div>
            <div className="text-xs sm:text-sm text-gray-300 mt-1.5 font-medium">Verified TripAdvisor Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
