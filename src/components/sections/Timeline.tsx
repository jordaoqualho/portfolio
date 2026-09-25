"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motionAllowed, MOTION_CHANGE } from "@/lib/motion";

// The rail fills as the reader moves through the roles; each node lights up
// when the fill reaches it. Without JavaScript the rail is simply complete.
export function Timeline({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const rail = root?.querySelector<HTMLElement>(".timeline-rail");
    if (!root || !rail) return;
    const rows = [...root.querySelectorAll<HTMLElement>(".experience-row")];
    let stops: number[] = [];
    let length = 0;
    let current = 0;
    let target = 0;
    let frame = 0;

    const measure = () => {
      const origin = root.getBoundingClientRect();
      const nodes = rows.map((row) =>
        row.querySelector(".timeline-node")!.getBoundingClientRect(),
      );
      if (!nodes.length) return;
      const first = nodes[0].top + nodes[0].height / 2 - origin.top;
      stops = nodes.map(
        (node) => node.top + node.height / 2 - origin.top - first,
      );
      length = stops.at(-1)! + Math.min(160, rows.at(-1)!.offsetHeight / 2);
      rail.style.top = `${first}px`;
      rail.style.height = `${length}px`;
      rail.style.left = `${nodes[0].left + nodes[0].width / 2 - origin.left}px`;
    };

    const paint = () => {
      const progress = length ? current / length : 1;
      rail.style.setProperty("--timeline-progress", progress.toFixed(4));
      rail.style.setProperty("--timeline-head", `${current.toFixed(1)}px`);
      let latest = -1;
      rows.forEach((row, i) => {
        const reached = stops[i] <= current + 1;
        if (reached) latest = i;
        row.toggleAttribute("data-reached", reached);
      });
      rows.forEach((row, i) =>
        row.toggleAttribute("data-current", i === latest),
      );
      root.toggleAttribute("data-complete", progress >= 0.999);
    };

    // The fill eases toward the scroll position instead of snapping to it.
    const tick = () => {
      current += (target - current) * 0.14;
      if (Math.abs(target - current) < 0.5) current = target;
      paint();
      frame = current === target ? 0 : requestAnimationFrame(tick);
    };

    const update = () => {
      const anchor = window.innerHeight * 0.62;
      const top = rail.getBoundingClientRect().top;
      target = Math.max(0, Math.min(length, anchor - top));
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const enable = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      measure();
      if (motionAllowed()) {
        root.dataset.enhanced = "";
        update();
      } else {
        delete root.dataset.enhanced;
        current = target = length;
        paint();
      }
    };

    const onScroll = () => root.hasAttribute("data-enhanced") && update();
    const resize = new ResizeObserver(enable);
    resize.observe(root);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener(MOTION_CHANGE, enable);
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    preference.addEventListener("change", enable);
    enable();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(MOTION_CHANGE, enable);
      preference.removeEventListener("change", enable);
    };
  }, []);

  return (
    <div ref={ref} className="timeline">
      <div className="timeline-rail" aria-hidden="true">
        <span className="timeline-fill" />
        <span className="timeline-head" />
      </div>
      {children}
    </div>
  );
}
