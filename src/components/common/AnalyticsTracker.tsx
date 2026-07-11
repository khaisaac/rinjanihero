"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Capture UTM parameters & referrer on first visit
    const utmSource = searchParams.get("utm_source");
    const utmMedium = searchParams.get("utm_medium");
    const utmCampaign = searchParams.get("utm_campaign");

    if (utmSource && !sessionStorage.getItem("rh_utm_source")) {
      sessionStorage.setItem("rh_utm_source", utmSource);
    }
    if (utmMedium && !sessionStorage.getItem("rh_utm_medium")) {
      sessionStorage.setItem("rh_utm_medium", utmMedium);
    }
    if (utmCampaign && !sessionStorage.getItem("rh_utm_campaign")) {
      sessionStorage.setItem("rh_utm_campaign", utmCampaign);
    }

    if (document.referrer && !sessionStorage.getItem("rh_referrer")) {
      sessionStorage.setItem("rh_referrer", document.referrer);
    }

    // Save current path as previous visited path for smart return_url
    const prevPath = sessionStorage.getItem("rh_current_path");
    if (prevPath && prevPath !== pathname) {
      sessionStorage.setItem("rh_return_url", prevPath);
    }
    sessionStorage.setItem("rh_current_path", pathname);
  }, [pathname, searchParams]);

  return null;
}
