"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motionAllowed, MOTION_CHANGE } from "@/lib/motion";

// The rail fills as the reader moves through the roles; each node lights up
// when the fill reaches it. The rail runs to the bottom edge of the section,
// where the head lands and opens into a horizontal line: the divider of the
// next section. Without JavaScript the rail is simply complete.
export function Timeline({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const rail = root?.querySelector<HTMLElement>(".timeline-rail");
    const fill = root?.querySelector<HTMLElement>(".timeline-fill");
    const head = root?.querySelector<HTMLElement>(".timeline-head");
    const handoff = root?.querySelector<HTMLElement>(".timeline-handoff");
    if (!root || !rail || !fill || !head || !handoff) return;
    const section = root.closest("section") ?? root;
    const rows = [...root.querySelectorAll<HTMLElement>(".experience-row")];
    let stops: number[] = [];
    let length = 0;
    let current = 0;
    let target = 0;
    let frame = 0;
    let last = 0;
    let reached = -2;
    let complete: boolean | null = null;

    const measure = () => {
      const origin = root.getBoundingClientRect();
      const nodes = rows.map((row) =>
        row.querySelector(".timeline-node")!.getBoundingClientRect(),
      );
      if (!nodes.length) return;
      const first = nodes[0].top + nodes[0].height / 2 - origin.top;
      const x = nodes[0].left + nodes[0].width / 2 - origin.left;
      stops = nodes.map(
        (node) => node.top + node.height / 2 - origin.top - first,
      );
      // End exactly on the section's bottom edge, where the next one begins.
      const end = section.getBoundingClientRect().bottom - origin.top;
      length = Math.max(stops.at(-1)!, end - first);
      rail.style.top = `${first}px`;
      rail.style.height = `${length}px`;
      rail.style.left = `${x}px`;
      handoff.style.top = `${first + length}px`;
      handoff.style.transformOrigin = `${x}px 50%`;
      handoff.style.setProperty(
        "--handoff-peak",
        `${((x / origin.width) * 100).toFixed(1)}%`,
      );
    };

    // Writes only what changed, so a scroll frame costs two transforms.
    const paint = () => {
      const progress = length ? current / length : 1;
      fill.style.transform = `scaleY(${progress.toFixed(4)})`;
      head.style.transform = `translate3d(0, ${current.toFixed(1)}px, 0)`;
      let latest = -1;
      for (let i = 0; i < stops.length; i++) if (stops[i] <= current + 1) latest = i;
      if (latest !== reached) {
        reached = latest;
        rows.forEach((row, i) => {
          row.toggleAttribute("data-reached", i <= latest);
          row.toggleAttribute("data-current", i === latest);
        });
      }
      const done = progress >= 0.999;
      if (done !== complete) {
        complete = done;
        root.toggleAttribute("data-complete", done);
      }
    };

    // Time-based easing toward the scroll position: the same feel at 60Hz and 120Hz.
    const tick = (now: number) => {
      const dt = last ? Math.min(now - last, 64) : 16;
      last = now;
      current += (target - current) * (1 - Math.exp(-dt / 90));
      if (Math.abs(target - current) < 0.4) current = target;
      paint();
      if (current === target) {
        frame = 0;
        last = 0;
      } else frame = requestAnimationFrame(tick);
    };

    const update = () => {
      const anchor = window.innerHeight * 0.6;
      const top = rail.getBoundingClientRect().top;
      target = Math.max(0, Math.min(length, anchor - top));
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const enable = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
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
    resize.observe(section);
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
      <span className="timeline-handoff" aria-hidden="true" />
      {children}
    </div>
  );
}
