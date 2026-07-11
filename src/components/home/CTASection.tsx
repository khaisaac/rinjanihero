"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneCall, Send, Mountain, CalendarCheck, Sparkles, HeartHandshake } from "lucide-react";
import { useCMSStore } from "@/store/cmsStore";

export default function CTASection() {
  const router = useRouter();
  const { settings, setBookingPrefill } = useCMSStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("Sembalun Summit 2D1N");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappText = `Hello Rinjani Hero! My name is ${name}. I am interested in ${selectedRoute}. Contact email: ${email}, phone: ${phone}. Notes: ${notes}`;
    window.open(
      `https://wa.me/${settings.contactWhatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(whatsappText)}`,
      "_blank"
    );
  };

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-[#122826] via-[#153835] to-[#122826] text-white relative overflow-hidden">
      {/* Glow decorations */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#18979B]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#D4A017]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content (6 spans) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#D4A017]/20 text-[#D4A017] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[#D4A017]/40">
              <Sparkles className="w-4 h-4" />
              <span>Ready for the Adventure of a Lifetime?</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Let&apos;s Plan Your Mount Rinjani Expedition Today
            </h2>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              Whether you are a solo traveler, couple, or private group—our Senaru basecamp team is ready to organize everything from your official E-Rinjani permits to your private hotel transfers.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#18979B] flex items-center justify-center text-white shrink-0 shadow">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-bold">24/7 WhatsApp Hotline</span>
                  <a href={`tel:${settings.contactPhone}`} className="text-base font-bold text-white hover:text-[#D4A017] transition">
                    {settings.contactWhatsapp}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4A017] flex items-center justify-center text-[#122826] shrink-0 shadow">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-bold">Basecamp Location</span>
                  <p className="text-sm font-semibold text-white">Senaru Village, North Lombok (100m from Waterfall Gate)</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => router.push("/booking")}
                className="bg-gradient-to-r from-[#D4A017] to-[#B8860B] hover:from-[#F3C644] text-[#122826] font-extrabold px-8 py-4 rounded-2xl shadow-xl transition transform hover:-translate-y-0.5 flex items-center gap-2 text-base"
              >
                <CalendarCheck className="w-5 h-5" />
                <span>Book Direct Now</span>
              </button>
            </div>
          </div>

          {/* Right Custom Trip Inquiry Box (6 spans) */}
          <div className="lg:col-span-6">
            <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                <Send className="w-5 h-5 text-[#D4A017]" />
                <span>Quick Inquiry & Custom Planning</span>
              </h3>
              <p className="text-xs text-gray-300 mb-6">
                Fill out your details below and our team will instantly reply via WhatsApp with a customized quote and itinerary suggestions.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Harrison"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#18979B]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">WhatsApp / Phone *</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 415 ..."
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#18979B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@gmail.com"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#18979B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Preferred Trek / Route</label>
                  <select
                    value={selectedRoute}
                    onChange={(e) => setSelectedRoute(e.target.value)}
                    className="w-full bg-[#122826] border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#18979B]"
                  >
                    <option value="2D1N Sembalun Summit Trek">2D1N Sembalun Summit Trek ($175)</option>
                    <option value="3D2N Sembalun Summit & Torean Route">3D2N Summit, Lake & Torean Route ($235)</option>
                    <option value="2D1N Senaru Crater Rim Sunset">2D1N Senaru Crater Rim Sunset ($155)</option>
                    <option value="4D3N Complete Rinjani Expedition">4D3N Complete Expedition ($289)</option>
                    <option value="Private / Custom Itinerary">Private / Custom VIP Expedition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Additional Notes / Questions</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any dietary preferences, hotel transfer location, or fitness questions?"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#18979B]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#18979B] hover:bg-[#13797C] text-white font-bold py-3.5 px-6 rounded-xl shadow transition flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                >
                  <Send className="w-4 h-4" />
                  <span>Send WhatsApp Inquiry Now</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
