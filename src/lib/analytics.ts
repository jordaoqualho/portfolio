import posthog from "posthog-js";

export const ANALYTICS_DISABLED_KEY = "analytics-disabled";
export const ANALYTICS_PREFERENCE_CHANGE = "analytics-preference-change";

function readPreference() {
  try {
    return window.localStorage.getItem(ANALYTICS_DISABLED_KEY) === "1";
  } catch {
    return false;
  }
}

export function isAnalyticsDisabled() {
  return typeof window !== "undefined" && readPreference();
}

export function subscribeAnalyticsPreference(listener: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(ANALYTICS_PREFERENCE_CHANGE, listener);
  return () => window.removeEventListener(ANALYTICS_PREFERENCE_CHANGE, listener);
}

function notifyPreferenceChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(ANALYTICS_PREFERENCE_CHANGE));
  }
}

export function isAnalyticsOptOutRoute() {
  if (typeof window === "undefined") return false;
  return /^\/(?:pt\/)?interno\/?$/.test(window.location.pathname);
}

export function disableAnalytics() {
  try {
    window.localStorage.setItem(ANALYTICS_DISABLED_KEY, "1");
  } catch {}
  notifyPreferenceChanged();

  try {
    posthog.opt_out_capturing();
    posthog.stopSessionRecording();
  } catch {}
}

export function enableAnalytics() {
  try {
    window.localStorage.removeItem(ANALYTICS_DISABLED_KEY);
  } catch {}
  notifyPreferenceChanged();

  try {
    posthog.opt_in_capturing();
  } catch {}
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (isAnalyticsDisabled()) return;
  try {
    posthog.capture(event, properties);
  } catch {}
}
