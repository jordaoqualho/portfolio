"use client";

import { useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";
import { MOTION_CHANGE } from "@/lib/motion";
import { useUi } from "@/i18n/provider";

function subscribe(listener: () => void) {
  window.addEventListener(MOTION_CHANGE, listener);
  return () => window.removeEventListener(MOTION_CHANGE, listener);
}
const getSnapshot = () => document.documentElement.dataset.motion === "paused";
const getServerSnapshot = () => false;

export function MotionPreferences() {
  const t = useUi().motion;
  const paused = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  function toggle() {
    const next = document.documentElement.dataset.motion !== "paused";
    document.documentElement.dataset.motion = next ? "paused" : "enabled";
    try {
      localStorage.setItem("motion", next ? "paused" : "enabled");
    } catch {}
    window.dispatchEvent(new Event(MOTION_CHANGE));
  }

  return (
    <button
      type="button"
      data-motion-toggle
      className="motion-toggle"
      aria-label={paused ? t.resumeLabel : t.pauseLabel}
      aria-pressed={paused}
      onClick={toggle}
    >
      <span className="motion-play">
        <Play aria-hidden="true" />
      </span>
      <span className="motion-pause">
        <Pause aria-hidden="true" />
      </span>
      <span className="motion-pause">{t.pause}</span>
      <span className="motion-play">{t.resume}</span>
    </button>
  );
}
