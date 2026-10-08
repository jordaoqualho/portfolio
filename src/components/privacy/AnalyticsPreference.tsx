"use client";

import { useSyncExternalStore } from "react";
import { useUi } from "@/i18n/provider";
import {
  disableAnalytics,
  enableAnalytics,
  isAnalyticsDisabled,
  subscribeAnalyticsPreference,
} from "@/lib/analytics";

export function AnalyticsPreference() {
  const t = useUi().privacyPage;
  const disabled = useSyncExternalStore(
    subscribeAnalyticsPreference,
    isAnalyticsDisabled,
    () => false,
  );

  const toggle = () => {
    if (disabled) {
      enableAnalytics();
      window.location.reload();
      return;
    }

    disableAnalytics();
  };

  return (
    <div className="analytics-preference" aria-live="polite">
      <p>
        {disabled ? t.analyticsDisabled : t.analyticsEnabled}
      </p>
      <button
        type="button"
        className="button secondary"
        onClick={toggle}
      >
        {disabled ? t.analyticsEnable : t.analyticsDisable}
      </button>
    </div>
  );
}
