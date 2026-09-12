"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Pause, Play } from "lucide-react";

function subscribe(listener: () => void) {
  window.addEventListener("portfolio-motion-change", listener);
  return () => window.removeEventListener("portfolio-motion-change", listener);
}
const getSnapshot = () => document.documentElement.dataset.motion === "paused";
const getServerSnapshot = () => false;

export function MotionPreferences() {
  const paused = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const pathname = usePathname();

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          if (
            preference.matches ||
            document.documentElement.dataset.motion === "paused"
          )
            continue;
          const animation = entry.target.animate(
            [
              { opacity: 0.6, transform: "translateY(12px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 520, easing: "cubic-bezier(.2,.7,.2,1)" },
          );
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        }
      },
      { threshold: 0.12 },
    );
    const stop = () => {
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    };
    preference.addEventListener("change", stop);
    window.addEventListener("portfolio-motion-change", stop);
    document
      .querySelectorAll(
        ".case-row, .experience-row, .principles li, .case-prose section",
      )
      .forEach((element) => {
        // Initial viewport content stays immediately visible, with no entrance delay.
        if (element.getBoundingClientRect().top >= window.innerHeight)
          observer.observe(element);
      });
    return () => {
      observer.disconnect();
      stop();
      preference.removeEventListener("change", stop);
      window.removeEventListener("portfolio-motion-change", stop);
    };
  }, [pathname]);

  function toggle() {
    const next = document.documentElement.dataset.motion !== "paused";
    document.documentElement.dataset.motion = next ? "paused" : "enabled";
    try {
      localStorage.setItem("motion", next ? "paused" : "enabled");
    } catch {}
    window.dispatchEvent(new Event("portfolio-motion-change"));
  }

  return (
    <button
      type="button"
      data-motion-toggle
      className="motion-toggle"
      aria-label={paused ? "Resume animations" : "Pause animations"}
      aria-pressed={paused}
      onClick={toggle}
    >
      <span className="motion-play">
        <Play aria-hidden="true" />
      </span>
      <span className="motion-pause">
        <Pause aria-hidden="true" />
      </span>
      <span className="motion-pause">Pause motion</span>
      <span className="motion-play">Resume motion</span>
    </button>
  );
}
