"use client";

import { useRouter } from "next/navigation";
import { Ticket, ShieldCheck, CheckCircle2, ArrowRight, QrCode } from "lucide-react";
import { useCMSStore } from "@/store/cmsStore";
import { ETicketOption } from "@/types/cms";

export default function ETicketSection() {
  const router = useRouter();
  const { eTickets, setBookingPrefill } = useCMSStore();

  const handleBookTicket = (ticket: ETicketOption) => {
    setBookingPrefill({
      serviceType: "E-Ticket",
      route: ticket.title,
      adults: 2,
      returnUrl: "/#eticket",
    });
    router.push("/booking");
  };

  return (
    <section id="eticket" className="py-20 lg:py-28 bg-[#122826] text-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#18979B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4A017]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#18979B]/20 text-[#18979B] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[#18979B]/40">
            <Ticket className="w-4 h-4" />
            <span>Official National Park E-Tickets</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            E-Rinjani Entrance Registration
          </h2>
          <p className="text-gray-300 text-base sm:text-lg">
            Every trekker entering Mount Rinjani National Park must hold an official barcode E-Ticket and compulsory insurance. We register your passport directly into the park&apos;s digital portal with instant confirmation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {eTickets.map((ticket, index) => (
            <div
              key={ticket.id}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 border ${
                index === 0
                  ? "bg-gradient-to-b from-[#18979B]/20 to-[#122826] border-[#18979B] shadow-2xl relative"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              {index === 0 && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D4A017] text-[#122826] text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full shadow">
                  Most Popular For Trekkers
                </div>
              )}

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#D4A017]">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-white">${ticket.priceUSD}</span>
                    <span className="text-xs text-gray-400 block">/ person ({ticket.priceIDR.toLocaleString()} IDR)</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">{ticket.title}</h3>
                  <p className="text-xs text-gray-300 mt-2 leading-relaxed">{ticket.description}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/10">
                  <span className="text-xs font-bold text-[#D4A017] uppercase tracking-wider block">Key Features:</span>
                  {ticket.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Requirements:</span>
                  {ticket.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017]" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-6 border-t border-white/10">
                <button
                  onClick={() => handleBookTicket(ticket)}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg ${
                    index === 0
                      ? "bg-gradient-to-r from-[#D4A017] to-[#B8860B] hover:from-[#F3C644] text-[#122826]"
                      : "bg-[#18979B] hover:bg-[#13797C] text-white"
                  }`}
                >
                  <span>Order Official E-Ticket</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-xs text-gray-400 max-w-xl mx-auto">
          <p>
            💡 <strong className="text-white">Good News:</strong> If you book any of our 2D1N, 3D2N, or 4D3N all-inclusive Trekking Packages, your official E-Rinjani ticket is <strong className="text-emerald-400 font-bold">already 100% INCLUDED</strong> in the package price! You do not need to buy it separately.
          </p>
        </div>
      </div>
    </section>
  );
}
