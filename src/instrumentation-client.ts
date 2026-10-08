import posthog from "posthog-js";
import { isAnalyticsDisabled, isAnalyticsOptOutRoute } from "@/lib/analytics";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

if (token && !isAnalyticsDisabled() && !isAnalyticsOptOutRoute()) {
  posthog.init(token, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: "2026-05-30",
    person_profiles: "identified_only",
  });
}
