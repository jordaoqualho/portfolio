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
    const shouldReduce = () =>
      preference.matches || document.documentElement.dataset.motion === "paused";
    const reveal = (element: Element, delay = 0) => {
      if (shouldReduce()) return;
      const resume = element.getAttribute("data-reveal") === "resume";
      const animation = element.animate(
        [
          { opacity: 0, transform: `translateY(${resume ? 8 : 14}px)` },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: resume ? 650 : 520,
          delay,
          easing: "cubic-bezier(.2,.7,.2,1)",
          fill: "backwards",
        },
      );
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        let index = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          reveal(entry.target, Math.min(index++ * 65, 195));
        }
      },
      { threshold: 0.08 },
    );
    const stop = () => {
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    };
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      let index = 0;
      document.querySelectorAll(
        "[data-reveal], .hero-topline, .hero-copy > :not(.hero-ctas), .hero-ctas > a, .profile-aside, .snapshot > div, .section-heading, .capability-grid > div, .case-row, .experience-row, .stack-groups > div, .about-copy > p, .principles li, .contact-grid > div, .case-detail-header, .case-prose section",
      ).forEach((element) => {
        // Animate leaves only so nested entrance transforms never compound.
        if (element.parentElement?.closest("[data-reveal], .contact-grid > div")) return;
        const bounds = element.getBoundingClientRect();
        if (bounds.bottom <= 0) return;
        if (bounds.top < window.innerHeight) {
          reveal(element, Math.min(index++ * 55, 275));
        } else {
          observer.observe(element);
        }
      });
    };
    preference.addEventListener("change", stop);
    window.addEventListener("portfolio-motion-change", stop);
    window.addEventListener("portfolio-ready", start);
    if (document.documentElement.dataset.loading !== "pending") start();
    return () => {
      window.removeEventListener("portfolio-ready", start);
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
