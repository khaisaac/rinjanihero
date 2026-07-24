"use client";

import {
  ShieldCheck,
  Award,
  DollarSign,
  HeartPulse,
  Utensils,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import * as Icons from "lucide-react";
import { useCMSStore } from "@/store/cmsStore";

export default function WhyChooseUs() {
  const { settings } = useCMSStore();
  const reasons = settings.whyChooseUs || [];

  return (
    <section id="why-choose-us" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#18979B]/10 text-[#18979B] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Why Choose Rinjani Hero?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#122826] tracking-tight">
            The Gold Standard in Rinjani Expeditions
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            We don&apos;t just lead climbs; we create lifelong memories while maintaining the highest safety and ethical porter standards in Lombok.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((item, idx) => {
            const IconComponent = (Icons as any)[item.icon] || Icons.CheckCircle;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#F8FAF9] border border-gray-100 hover:border-[#18979B]/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1.5"
              >
                <div className="space-y-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition duration-300`}>
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[#122826] group-hover:text-[#18979B] transition">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-200/50 flex items-center gap-1.5 text-xs font-semibold text-[#18979B]">
                  <span>Rinjani Hero Standard</span>
                  <span>★</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
