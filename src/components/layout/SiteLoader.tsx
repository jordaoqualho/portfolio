"use client";

import { useEffect, useRef } from "react";
import { ease, READY_EVENT } from "@/lib/motion";

const MIN_VISIBLE = 950;
const MAX_WAIT = 2600;
// Module scoped so StrictMode's double effect run cannot start two exits.
let exiting = false;

// CSS drives the first part of the intro, so it animates before hydration.
// This component waits for what the first screen actually needs, then exits.
export function SiteLoader() {
  const loader = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const element = loader.current;
    if (root.dataset.loading !== "pending" || !element) return;

    const animations: Animation[] = [];
    const release = () => {
      root.dataset.loading = "ready";
      animations.forEach((animation) => animation.cancel());
    };

    const exit = async (quick = false) => {
      if (exiting) return;
      exiting = true;
      try {
        sessionStorage.setItem("intro-seen", "1");
      } catch {}
      const run = (
        target: Element | null,
        keyframes: Keyframe[],
        options: KeyframeAnimationOptions,
      ) => {
        if (!target) return;
        const animation = target.animate(keyframes, {
          fill: "forwards",
          ...options,
        });
        animations.push(animation);
        return animation.finished.catch(() => {});
      };
      const speed = quick ? 0.45 : 1;

      const load =
        parseFloat(getComputedStyle(element).getPropertyValue("--load")) || 0;
      await run(element, [{ "--load": load }, { "--load": 100 }], {
        duration: 320 * speed,
        easing: ease.out,
      });

      element.querySelectorAll(".loader-glyph").forEach((glyph, i) =>
        run(
          glyph,
          [{ transform: "translateY(0)" }, { transform: "translateY(-110%)" }],
          {
            duration: 520 * speed,
            delay: i * 45 * speed,
            easing: ease.inOut,
          },
        ),
      );
      run(
        element.querySelector(".loader-meta"),
        [{ opacity: 1 }, { opacity: 0 }],
        {
          duration: 260 * speed,
        },
      );
      run(
        element.querySelector(".loader-meter"),
        [
          { transform: "scaleX(1)", transformOrigin: "right" },
          { transform: "scaleX(0)", transformOrigin: "right" },
        ],
        { duration: 420 * speed, easing: ease.inOut },
      );

      // The curtain starts lifting while the mark is still leaving.
      const wipe: Keyframe[] = [
        { clipPath: "inset(0 0 0 0)" },
        { clipPath: "inset(0 0 100% 0)" },
      ];
      const panel = run(element.querySelector(".loader-panel"), wipe, {
        duration: 900 * speed,
        delay: 280 * speed,
        easing: ease.inOut,
      });
      const accent = run(element.querySelector(".loader-panel-accent"), wipe, {
        duration: 900 * speed,
        delay: 360 * speed,
        easing: ease.inOut,
      });
      // The hero starts while the curtain lifts so the handoff reads as one motion.
      setTimeout(
        () => window.dispatchEvent(new Event(READY_EVENT)),
        540 * speed,
      );
      await Promise.all([panel, accent]);
      release();
    };

    const heroImage = document.querySelector<HTMLImageElement>(".hero img");
    const imageReady =
      heroImage && !heroImage.complete
        ? heroImage.decode().catch(() => {})
        : Promise.resolve();
    const minimum = new Promise((resolve) =>
      setTimeout(resolve, Math.max(0, MIN_VISIBLE - performance.now())),
    );
    const cap = new Promise((resolve) =>
      setTimeout(resolve, MAX_WAIT - performance.now()),
    );

    Promise.race([
      Promise.all([document.fonts.ready, imageReady, minimum]),
      cap,
    ]).then(() => exit());
    // Never make someone who is already interacting wait for the intro.
    const skip = () => exit(true);
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("wheel", skip, { once: true, passive: true });
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("wheel", skip);
    };
  }, []);

  return (
    <div ref={loader} className="site-loader" aria-hidden="true">
      <div className="loader-panel-accent" />
      <div className="loader-panel">
        <div className="loader-content">
          <span className="loader-mark">
            <span className="loader-glyph">j</span>
            <span className="loader-glyph">q</span>
            <span className="loader-glyph loader-dot">.</span>
          </span>
          <span className="loader-meter">
            <span />
          </span>
          <span className="loader-meta">
            <span>Senior Software Engineer</span>
            <span className="loader-count" />
          </span>
        </div>
      </div>
    </div>
  );
}
