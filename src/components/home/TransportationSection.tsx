"use client";

import { useRouter } from "next/navigation";
import { Truck, Users, Clock, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { useCMSStore } from "@/store/cmsStore";
import { TransportationService } from "@/types/cms";

export default function TransportationSection() {
  const router = useRouter();
  const { transportation, setBookingPrefill } = useCMSStore();

  const handleBookTransport = (item: TransportationService) => {
    setBookingPrefill({
      serviceType: "Transportation",
      route: item.destination,
      adults: 2,
      returnUrl: "/#transportation",
    });
    router.push(`/booking?serviceType=Transportation&transportId=${item.id}`);
  };

  return (
    <section id="transportation" className="py-20 lg:py-28 bg-[#F8FAF9] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#18979B]/10 text-[#18979B] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Truck className="w-4 h-4" />
            <span>Private Transportation Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#122826] tracking-tight">
            Comfortable & Reliable Lombok Transfers
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Skip the stress of public buses. We offer clean, air-conditioned private SUVs and vans directly from Lombok Airport (LOP), Bangsal Harbor, Senggigi, or Kuta to our Senaru basecamp and your hotel.
          </p>
        </div>

        {/* Transportation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transportation.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between group transform hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#18979B]/10 group-hover:bg-[#18979B] text-[#18979B] group-hover:text-white transition duration-300 flex items-center justify-center font-bold">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#122826]">${item.priceUSD}</span>
                    <span className="text-xs text-gray-400 block font-medium">/ vehicle ({item.priceIDR.toLocaleString()} IDR)</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#122826] group-hover:text-[#18979B] transition">
                  {item.destination}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-gray-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#18979B]" />
                    <span>{item.capacity}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#D4A017]" />
                    <span>{item.duration}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  Fixed Price Guaranteed
                </span>
                <button
                  onClick={() => handleBookTransport(item)}
                  className="px-4 py-2.5 rounded-xl bg-[#122826] group-hover:bg-[#18979B] text-white font-bold text-xs transition flex items-center gap-1.5 shadow"
                >
                  <span>Book Transfer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
