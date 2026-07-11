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

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: Award,
      title: "Experienced Local Guides",
      description: "Our guides and porters are native to Senaru with 10+ years of climbing experience on Mount Rinjani.",
      color: "from-[#18979B] to-[#13797C]",
    },
    {
      icon: ShieldCheck,
      title: "Licensed Official Company",
      description: "Fully registered and recognized by the Rinjani National Park office and Indonesian Ministry of Tourism.",
      color: "from-[#D4A017] to-[#B8860B]",
    },
    {
      icon: DollarSign,
      title: "Best Price Guarantee",
      description: "Direct operator rates with zero middleman agency fees or hidden costs. Deposit only 30% to secure your dates.",
      color: "from-[#18979B] to-[#13797C]",
    },
    {
      icon: HeartPulse,
      title: "Safety First Standards",
      description: "Every trek is equipped with emergency oxygen cylinders, first aid kits, and guides certified in mountain wilderness rescue.",
      color: "from-[#D4A017] to-[#B8860B]",
    },
    {
      icon: Utensils,
      title: "Gourmet Mountain Dining",
      description: "Enjoy 3 freshly cooked, nutritious hot meals per day + tropical fruit platters, banana pancakes, tea, and Lombok coffee.",
      color: "from-[#18979B] to-[#13797C]",
    },
    {
      icon: CalendarDays,
      title: "Flexible Rescheduling",
      description: "Plans changed? Modify your trekking dates 100% free of charge with at least 7 days notice.",
      color: "from-[#D4A017] to-[#B8860B]",
    },
  ];

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
            const IconComponent = item.icon;
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
