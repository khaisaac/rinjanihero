"use client";

import { useState } from "react";
import { Camera, Maximize2, X, MapPin, Calendar, Sparkles } from "lucide-react";
import { useCMSStore } from "@/store/cmsStore";
import { GalleryItem } from "@/types/cms";

export default function GallerySection() {
  const { gallery } = useCMSStore();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const filteredGallery =
    activeCategory === "all"
      ? gallery
      : gallery.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-[#F8FAF9] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#18979B]/10 text-[#18979B] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Camera className="w-4 h-4" />
            <span>Expedition Moments</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#122826] tracking-tight">
            Real Moments on Mount Rinjani
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Take a glimpse into the golden sunrises, turquoise lakes, delicious mountain camping feasts, and smiling faces of our trekkers.
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: "all", label: "📸 All Photos" },
              { id: "summit", label: "🏔️ Summit 3,726m" },
              { id: "lake", label: "🌊 Segara Anak Lake" },
              { id: "torean", label: "🏞️ Torean Valley" },
              { id: "camp", label: "⛺ Camping & Porters" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeCategory === cat.id
                    ? "bg-[#18979B] text-white shadow-md transform scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group relative h-72 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition duration-500 cursor-pointer bg-black"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 group-hover:opacity-90 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] bg-[#D4A017] text-[#122826] font-bold uppercase px-2.5 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <Maximize2 className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-base font-bold text-white line-clamp-1">{item.title}</h4>
                <div className="flex items-center gap-3 text-[11px] text-gray-300 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#18979B]" />
                    {item.location}
                  </span>
                  <span>•</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative max-w-5xl w-full bg-[#122826] rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <div className="p-4 bg-[#122826] flex items-center justify-between border-b border-white/10 text-white">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#D4A017]" />
                <span className="font-bold text-sm">{selectedImage.title}</span>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 text-gray-400 hover:text-white bg-white/10 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[75vh] flex items-center justify-center bg-black overflow-hidden">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="max-w-full max-h-[75vh] object-contain"
              />
            </div>
            <div className="p-4 bg-[#122826] text-xs text-gray-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[#18979B] font-semibold">
                  <MapPin className="w-3.5 h-3.5" />
                  {selectedImage.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#D4A017]" />
                  {selectedImage.date}
                </span>
              </div>
              <span className="text-gray-400">Captured by Rinjani Hero Expedition Team</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
