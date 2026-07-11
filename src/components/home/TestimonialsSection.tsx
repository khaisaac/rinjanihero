"use client";

import { Award, Star, CheckCircle2, MessageSquare, Quote } from "lucide-react";
import { useCMSStore } from "@/store/cmsStore";

export default function TestimonialsSection() {
  const { testimonials } = useCMSStore();

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#18979B]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-[#D4A017]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#D4A017]/15 text-[#A87E0E] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Verified Traveler Reviews</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#122826] tracking-tight">
            What Our Trekkers Say
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Read stories from travelers across Germany, UK, France, Australia, and Japan who conquered Mount Rinjani with our Senaru team.
          </p>

          <div className="flex items-center justify-center gap-6 pt-2 text-xs sm:text-sm font-semibold text-gray-700">
            <div className="flex items-center gap-1.5 bg-[#F8FAF9] px-4 py-2 rounded-xl border border-gray-200">
              <span className="text-[#D4A017] font-extrabold text-base">★ 4.9/5</span>
              <span>TripAdvisor Excellence</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#F8FAF9] px-4 py-2 rounded-xl border border-gray-200">
              <span className="text-emerald-600 font-extrabold text-base">★ 5.0/5</span>
              <span>Google Verified Reviews</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="p-8 rounded-3xl bg-[#F8FAF9] border border-gray-200 hover:border-[#18979B]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-gray-200 group-hover:text-[#18979B]/20 transition" />

              <div className="space-y-4">
                {/* Star Ratings */}
                <div className="flex items-center gap-1 text-[#D4A017]">
                  {Array.from({ length: test.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                  <span className="text-xs font-bold text-gray-600 ml-2">Verified {test.source} Review</span>
                </div>

                <p className="text-gray-700 text-sm sm:text-base leading-relaxed italic">
                  &ldquo;{test.comment}&rdquo;
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-200/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {test.avatarUrl ? (
                    <img
                      src={test.avatarUrl}
                      alt={test.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#18979B]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#18979B] text-white flex items-center justify-center font-bold text-lg">
                      {test.name[0]}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-extrabold text-[#122826] flex items-center gap-1.5">
                      <span>{test.name}</span>
                      {test.isVerified && (
                        <span title="Verified Trekker">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {test.country} • <span className="text-[#18979B] font-semibold">{test.date}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right hidden sm:block max-w-[180px]">
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Expedition Package</span>
                  <span className="text-xs font-bold text-[#122826] line-clamp-1">{test.packageTitle}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
