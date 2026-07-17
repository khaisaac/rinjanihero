"use client";

import { useState } from "react";
import { Shield, Users, Award, CheckCircle, Play, X, ArrowRight, Heart } from "lucide-react";

export default function AboutPreview() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <section id="about" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#18979B]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#D4A017]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text Bio (6 spans) */}
          <div className="lg:col-span-6 space-y-6 lg:space-y-7">
            <div className="inline-flex items-center gap-2 bg-[#18979B]/10 text-[#18979B] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Official Local Operator Since 2013</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#122826] tracking-tight leading-tight">
              A Journey Built on Passion & Local Expertise
            </h2>

            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              Founded and operated by native mountain guides from Senaru Village right at the base of Mount Rinjani, <strong className="text-[#18979B] font-bold">Rinjani Hero</strong> has been guiding adventurers from over 60 countries across Lombok&apos;s volcanic trails since 2013.
            </p>

            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              We believe that a truly unforgettable expedition starts with absolute safety, respect for nature, and taking genuine care of our local porter community. That is why every single trek we lead is equipped with storm-rated tents, thick sleeping mattresses, emergency oxygen, and three-course hot meals cooked fresh on the mountain.
            </p>

            {/* Core Values Bullet List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#18979B]/15 hover:border-[#18979B]/30 transition">
                <div className="w-9 h-9 rounded-xl bg-[#18979B]/10 text-[#18979B] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#122826]">Certified Wilderness Guides</h4>
                  <p className="text-xs text-gray-500 mt-0.5 leading-normal">Licensed under Rinjani National Park with first aid medical training.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#18979B]/15 hover:border-[#18979B]/30 transition">
                <div className="w-9 h-9 rounded-xl bg-[#D4A017]/10 text-[#D4A017] flex items-center justify-center shrink-0 mt-0.5">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#122826]">Fair Porter Welfare</h4>
                  <p className="text-xs text-gray-500 mt-0.5 leading-normal">We pay above standard wages and limit carrying loads to protect our team.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#18979B]/15 hover:border-[#18979B]/30 transition">
                <div className="w-9 h-9 rounded-xl bg-[#18979B]/10 text-[#18979B] flex items-center justify-center shrink-0 mt-0.5">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#122826]">Leave No Trace Eco-Treks</h4>
                  <p className="text-xs text-gray-500 mt-0.5 leading-normal">Our porters carry out 100% of our camping waste plus extra trail cleanup.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#18979B]/15 hover:border-[#18979B]/30 transition">
                <div className="w-9 h-9 rounded-xl bg-[#D4A017]/10 text-[#D4A017] flex items-center justify-center shrink-0 mt-0.5">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#122826]">Best Price Guarantee</h4>
                  <p className="text-xs text-gray-500 mt-0.5 leading-normal">Direct local pricing with zero hidden agency markup fees.</p>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="flex items-center gap-4 pt-4">
              <a
                href="#why-choose-us"
                className="inline-flex items-center gap-2 bg-[#18979B] hover:bg-[#13797C] text-white font-bold px-6 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition text-sm"
              >
                <span>Discover Why Choose Us</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Image / Video Preview (6 spans) */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white group bg-[#122826]">
              {/* NOTE: Untuk mengganti gambar cover ini, ubah URL pada atribut src di bawah ini */}
              <img
                src="https://images.unsplash.com/photo-1620737785233-6a848369d002?auto=format&fit=crop&w=1200&q=80"
                alt="Silhouette of people on Mount Rinjani during sunset - Rinjani Hero"
                className="w-full h-[480px] lg:h-[540px] object-cover group-hover:scale-105 transition duration-700"
              />

              {/* Top-Left Experience Badge - Precision Aligned Inside Container */}
              <div className="absolute top-6 left-6 z-20 bg-[#122826]/85 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-white/20 max-w-[270px] sm:max-w-[300px] transition group-hover:bg-[#122826]/95">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#18979B] to-[#13797C] flex items-center justify-center text-lg font-black text-white shrink-0 shadow-md border border-white/10">
                    10+
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#D4A017]">
                      Years Excellence
                    </h4>
                    <p className="text-[11px] text-gray-200 leading-snug mt-0.5 font-medium">
                      Proudly serving 1,000+ international climbers annually since 2013.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Overlay Info */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#122826]/95 via-[#122826]/40 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white pointer-events-none">
                <div className="relative z-10 sm:max-w-lg pointer-events-auto">
                  <span className="text-xs text-[#D4A017] font-bold uppercase tracking-wider block mb-1">
                    🎥 Watch Our Story
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                    Exploring Start From Sembalun & End At Torean
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1.5 leading-relaxed">
                    Join our local Sembalun team on an immersive 3-minute journey up the volcano.
                  </p>
                </div>
              </div>

              {/* Center Play Button */}
              <button
                onClick={() => setVideoModalOpen(true)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[#D4A017] text-[#122826] flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-[#F3C644] transition duration-300 z-30 border-2 border-white/20"
                aria-label="Play Expedition Video"
              >
                <Play className="w-8 h-8 fill-[#122826] ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Preview Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full bg-[#122826] rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <div className="p-4 bg-[#122826] flex items-center justify-between border-b border-white/10">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <Play className="w-4 h-4 text-[#D4A017]" />
                <span>Rinjani Hero Expedition Documentary Preview</span>
              </h3>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="text-gray-400 hover:text-white bg-white/10 p-2 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black relative flex items-center justify-center">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/PgGSvJXICpE?autoplay=1"
                title="Mount Rinjani Trekking Video - Rinjani Hero"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4 bg-[#122826] text-xs text-gray-300 flex items-center justify-between">
              <span>Shot on location in Senaru, Sembalun, and Segara Anak Lake.</span>
              <a href="#packages" onClick={() => setVideoModalOpen(false)} className="text-[#D4A017] font-bold hover:underline">
                Book This Experience →
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
