"use client";

import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import { useCMSStore } from "@/store/cmsStore";

export default function PackageTypesAccordion() {
  const { settings } = useCMSStore();
  const [openId, setOpenId] = useState<string | null>(null);

  const packageTypes = [
    {
      id: "standard",
      title: "Standard Package",
      description: settings.packageStandardDesc || "Standard packages are designed for budget-conscious trekkers.",
    },
    {
      id: "private",
      title: "Private Package",
      description: settings.packagePrivateDesc || "Private packages offer a premium, personalized trekking experience.",
    },
    {
      id: "meeting-point",
      title: "Meeting Point Package",
      description: settings.packageMeetingPointDesc || "Meeting Point packages are perfect for independent travelers.",
    },
  ];

  return (
    <div className="space-y-3 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-[#18979B]" />
        <h3 className="text-lg font-bold text-[#122826]">Understand Our Package Types</h3>
      </div>
      
      {packageTypes.map((pkg) => {
        const isOpen = openId === pkg.id;
        return (
          <div
            key={pkg.id}
            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
              isOpen
                ? "bg-white border-[#18979B] shadow-md"
                : "bg-white border-gray-200 hover:border-[#18979B]/40 shadow-sm"
            }`}
          >
            <button
              onClick={() => setOpenId(isOpen ? null : pkg.id)}
              className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 focus:outline-none"
            >
              <h4 className="text-sm sm:text-base font-bold text-[#122826]">{pkg.title}</h4>
              <ChevronDown
                className={`w-5 h-5 text-[#18979B] shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-4 sm:px-5 pb-5 pt-1 text-gray-600 text-sm leading-relaxed border-t border-gray-100/60 animate-in fade-in duration-200">
                {pkg.description}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
