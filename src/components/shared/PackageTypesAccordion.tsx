"use client";

import { useState } from "react";
import { ChevronDown, Info, CheckCircle2, XCircle } from "lucide-react";
import { useCMSStore } from "@/store/cmsStore";

import { TrekkingPackage } from "@/types/cms";

export default function PackageTypesAccordion({ pkgTypes }: { pkgTypes?: TrekkingPackage['packageTypes'] }) {
  const { settings } = useCMSStore();
  const [openId, setOpenId] = useState<string | null>(null);

  const packageTypes = [
    {
      id: "standard",
      title: "Standard Package",
      description: pkgTypes?.standard?.description || settings.packageStandardDesc || "Standard packages are designed for budget-conscious trekkers.",
      includes: pkgTypes?.standard?.includes || [],
      excludes: pkgTypes?.standard?.excludes || [],
    },
    {
      id: "private",
      title: "Private Package",
      description: pkgTypes?.private?.description || settings.packagePrivateDesc || "Private packages offer a premium, personalized trekking experience.",
      includes: pkgTypes?.private?.includes || [],
      excludes: pkgTypes?.private?.excludes || [],
    },
    {
      id: "meeting-point",
      title: "Meeting Point Package",
      description: pkgTypes?.meetingPoint?.description || settings.packageMeetingPointDesc || "Meeting Point packages are perfect for independent travelers.",
      includes: pkgTypes?.meetingPoint?.includes || [],
      excludes: pkgTypes?.meetingPoint?.excludes || [],
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
              <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-gray-100/60 animate-in fade-in duration-200">
                <div 
                  className="text-gray-600 text-sm leading-relaxed prose prose-sm max-w-none mb-6"
                  dangerouslySetInnerHTML={{ __html: pkg.description }}
                />
                
                {(pkg.includes.length > 0 || pkg.excludes.length > 0) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pkg.includes.length > 0 && (
                      <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                        <h5 className="text-sm font-bold text-emerald-800 flex items-center gap-1.5 mb-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          What is Included
                        </h5>
                        <ul className="space-y-2">
                          {pkg.includes.map((inc, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {pkg.excludes.length > 0 && (
                      <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100">
                        <h5 className="text-sm font-bold text-red-800 flex items-center gap-1.5 mb-3">
                          <XCircle className="w-4 h-4 text-red-500" />
                          What is Excluded
                        </h5>
                        <ul className="space-y-2">
                          {pkg.excludes.map((exc, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                              <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                              <span>{exc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
