"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, Sparkles } from "lucide-react";
import { useCMSStore } from "@/store/cmsStore";

export default function FAQSection() {
  const { faqs } = useCMSStore();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const categories = ["All", "Preparation", "Permits & Ticket", "Weather & Season", "Safety & Guide", "Payment & Booking"];

  const filteredFaqs =
    activeCategory === "All"
      ? faqs
      : faqs.filter((f) => f.category === activeCategory);

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#F8FAF9] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#18979B]/10 text-[#18979B] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#122826] tracking-tight">
            Everything You Need To Know
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Got questions about altitude sickness, national park permits, or what gear to pack? Find all your answers below.
          </p>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-[#18979B] text-white shadow-md transform scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-white border-[#18979B] shadow-lg"
                    : "bg-white border-gray-200 hover:border-[#18979B]/40 shadow-sm"
                }`}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-[#18979B]/10 text-[#18979B] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shrink-0 hidden sm:inline">
                      {faq.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#122826]">{faq.question}</h3>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#18979B] shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 text-gray-600 text-sm sm:text-base leading-relaxed border-t border-gray-100/60 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-6 rounded-3xl bg-[#18979B]/10 border border-[#18979B]/30 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-base font-bold text-[#122826]">Still have specific questions about your itinerary?</h4>
            <p className="text-xs sm:text-sm text-gray-600">Our expedition directors are online via WhatsApp 24/7 to assist you.</p>
          </div>
          <a
            href="https://wa.me/6285338938083?text=Hello%20Rinjani%20Hero,%20I%20have%20a%20question%20about%20trekking."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#18979B] hover:bg-[#13797C] text-white font-bold rounded-2xl text-sm transition shadow-md whitespace-nowrap shrink-0"
          >
            Chat with Expedition Guide
          </a>
        </div>
      </div>
    </section>
  );
}
