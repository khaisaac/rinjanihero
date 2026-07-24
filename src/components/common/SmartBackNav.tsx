"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Home } from "lucide-react";
import { useCMSStore } from "@/store/cmsStore";

export default function SmartBackNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [returnUrl, setReturnUrl] = useState<string | null>(null);
  const { bookingPrefill } = useCMSStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("rh_return_url");
      if (bookingPrefill?.returnUrl) {
        setReturnUrl(bookingPrefill.returnUrl);
      } else if (stored && stored !== pathname) {
        setReturnUrl(stored);
      }
    }
  }, [pathname, bookingPrefill]);

  // Only show on blog pages
  const shouldShow = pathname.startsWith("/blog/");
  if (!shouldShow) return null;

  const handleBack = () => {
    if (returnUrl && returnUrl !== pathname) {
      router.push(returnUrl);
    } else if (window.history.length > 2) {
      window.history.back();
    } else {
      router.push("/");
    }
  };

  const getLabel = () => {
    if (pathname.startsWith("/booking/payment")) return "Back to Booking Details";
    if (pathname.startsWith("/booking")) return returnUrl?.includes("/packages/") ? "Back to Package Details" : "Back to All Packages";
    if (pathname.startsWith("/packages/")) return "Back to Packages & Routes";
    if (pathname.startsWith("/blog/")) return "Back to Blog Articles";
    return "Back";
  };

  return (
    <div className="bg-[#18979B] text-white border-b border-white/20 sticky top-[72px] z-40 py-2.5 px-4 shadow-md transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 hover:text-[#D4A017] transition font-medium group"
        >
          <span className="w-6 h-6 rounded-full bg-[#18979B]/30 flex items-center justify-center group-hover:bg-[#D4A017] group-hover:text-[#122826] transition">
            <ArrowLeft className="w-3.5 h-3.5" />
          </span>
          <span>{getLabel()}</span>
        </button>
        <div className="flex items-center gap-4 text-gray-300">
          <span className="hidden md:inline text-xs bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
            Smart Navigation Active • Source Tracked
          </span>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 hover:text-[#D4A017] transition text-xs font-semibold"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
