"use client";

import { useEffect } from "react";
import { disableAnalytics } from "@/lib/analytics";

export default function InternalAnalyticsOptOutPage() {
  useEffect(() => {
    disableAnalytics();
    const home = window.location.pathname.startsWith("/pt/") ? "/pt/" : "/";
    window.location.replace(home);
  }, []);

  return null;
}
