"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  ease,
  finePointer,
  motionAllowed,
  MOTION_CHANGE,
  READY_EVENT,
} from "@/lib/motion";

type Play = (
  target: Element | null | undefined,
  keyframes: Keyframe[],
  options?: KeyframeAnimationOptions,
) => void;

const LABELS =
  ".section-heading .eyebrow, .contact-section .container > .eyebrow, .case-detail-header > .eyebrow, .case-index > .eyebrow, .not-found .eyebrow";
const HEADINGS =
  ".section-heading h2, .contact-grid h2, .case-detail-header h1, .not-found h1";
const BLOCKS =
  ".section-heading p, .contact-grid > div > p, .contact-actions, .contact-details, .case-detail-header > p, .case-detail-header > .tech-list, .project-detail-links, .project-shot, .back-link, .case-index nav, .case-prose section, .case-next, .about-copy > p, .principles h3, .principles li, .not-found p, .not-found .button, .agent-audience, .agent-cta, .project-card";
const CASES = ".case-row";
const ROLES = ".experience-row";
const STACK = ".stack-groups > div";
const REVEAL = [LABELS, HEADINGS, BLOCKS, CASES, ROLES, STACK].join(", ");

const fadeUp = (distance: number): Keyframe[] => [
  { opacity: 0, transform: `translateY(${distance}px)` },
  { opacity: 1, transform: "translateY(0)" },
];

// One animation per element, transform and opacity only. Chips, numbers and
// rows inside a block move with their block instead of on their own clocks,
// so a fast scroll never queues dozens of competing animations.
function reveal(element: Element, delay: number, play: Play) {
  if (element.matches(LABELS)) {
    play(
      element,
      [
        { opacity: 0, transform: "translateX(-8px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 500, delay },
    );
  } else if (element.matches(HEADINGS)) {
    // The clip window grows upward while the text rises into it.
    play(
      element,
      [
        {
          clipPath: "inset(100% -0.1em -0.3em -0.1em)",
          transform: "translateY(0.4em)",
        },
        {
          clipPath: "inset(-0.2em -0.1em -0.3em -0.1em)",
          transform: "translateY(0)",
        },
      ],
      { duration: 800, delay },
    );
  } else if (element.matches(CASES)) {
    play(element, fadeUp(24), { duration: 700, delay });
  } else if (element.matches(ROLES) || element.matches(STACK)) {
    play(element, fadeUp(14), { duration: 600, delay });
  } else {
    play(element, fadeUp(18), { duration: 650, delay });
  }
}

function heroIntro(play: Play) {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  hero
    .querySelectorAll(".hero-topline > *")
    .forEach((item, i) =>
      play(item, fadeUp(10), { duration: 700, delay: i * 80 }),
    );
  hero.querySelectorAll(".hero-line > span").forEach((line, i) =>
    play(line, [{ transform: "translateY(110%)" }, { transform: "none" }], {
      duration: 1000,
      delay: 100 + i * 110,
    }),
  );
  play(
    hero.querySelector(".hero-title .accent"),
    [
      { opacity: 0, transform: "scale(0)" },
      { opacity: 1, transform: "none" },
    ],
    { duration: 600, delay: 650, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
  );
  hero
    .querySelectorAll(".hero-copy > :not(h1)")
    .forEach((item, i) =>
      play(item, fadeUp(16), { duration: 800, delay: 380 + i * 70 }),
    );
  const portrait = hero.querySelector("[data-portrait]");
  play(
    portrait,
    [
      { clipPath: "inset(100% 0 0 0 round 5px)" },
      { clipPath: "inset(0 0 0 0 round 5px)" },
    ],
    { duration: 1100, delay: 200, easing: ease.inOut },
  );
  play(
    portrait?.querySelector("img"),
    [{ transform: "scale(1.15)" }, { transform: "none" }],
    { duration: 1500, delay: 200 },
  );
  play(hero.querySelector(".portrait-caption"), fadeUp(8), {
    duration: 600,
    delay: 900,
  });
}

// Section-aware navigation: a single marker glides to the link of the section
// in view. Direct links track their own hash; a dropdown trigger tracks the
// sections listed in its data-spy-for.
function scrollspy() {
  const cleanups: (() => void)[] = [];
  document.querySelectorAll<HTMLElement>("[data-scrollspy]").forEach((nav) => {
    const items = [
      ...nav.querySelectorAll<HTMLElement>(
        ":scope > a[href*='#'], :scope [data-spy-for]",
      ),
    ].map((element) => ({
      element,
      ids:
        element instanceof HTMLAnchorElement
          ? [new URL(element.href).hash.slice(1)]
          : (element.dataset.spyFor ?? "").split(" "),
    }));
    const sections = items
      .flatMap((item) => item.ids)
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length) return;
    const visible = new Set<Element>();
    const mark = () => {
      const current = sections.filter((section) => visible.has(section)).at(-1);
      const origin = nav.getBoundingClientRect();
      items.forEach(({ element, ids }) => {
        const active = Boolean(current && ids.includes(current.id));
        element.toggleAttribute("data-active", active);
        if (!active) return;
        const box = element.getBoundingClientRect();
        nav.style.setProperty("--spy-x", `${box.left - origin.left}px`);
        nav.style.setProperty("--spy-y", `${box.top - origin.top}px`);
        nav.style.setProperty("--spy-w", `${box.width}px`);
        nav.style.setProperty("--spy-h", `${box.height}px`);
      });
      nav.toggleAttribute("data-spy-active", Boolean(current));
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) =>
          entry.isIntersecting
            ? visible.add(entry.target)
            : visible.delete(entry.target),
        );
        mark();
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    window.addEventListener("resize", mark);
    cleanups.push(() => {
      observer.disconnect();
      window.removeEventListener("resize", mark);
      nav.removeAttribute("data-spy-active");
      items.forEach(({ element }) => element.removeAttribute("data-active"));
    });
  });
  return () => cleanups.forEach((cleanup) => cleanup());
}

const SPOTLIGHT = ".case-row, .experience-row";
const MAGNETIC =
  ".hero-ctas > a, .contact-actions > a, .header-cv, .case-next a";

// Pointer effects are delegated from the document, so they survive navigation.
function pointerEffects() {
  let magnet: HTMLElement | null = null;
  let frame = 0;
  let last: PointerEvent | null = null;
  const release = () => {
    magnet?.style.removeProperty("--mag-x");
    magnet?.style.removeProperty("--mag-y");
    magnet = null;
  };
  // Coalesced to one write per frame, however fast the pointer reports.
  const apply = () => {
    frame = 0;
    const event = last;
    if (!event) return;
    const target = event.target instanceof Element ? event.target : null;
    const spot = target?.closest<HTMLElement>(SPOTLIGHT);
    if (spot) {
      const box = spot.getBoundingClientRect();
      spot.style.setProperty("--spot-x", `${event.clientX - box.left}px`);
      spot.style.setProperty("--spot-y", `${event.clientY - box.top}px`);
    }
    if (!motionAllowed()) return release();
    const pull = target?.closest<HTMLElement>(MAGNETIC) ?? null;
    if (pull !== magnet) release();
    magnet = pull;
    if (pull) {
      const box = pull.getBoundingClientRect();
      const x = event.clientX - box.left - box.width / 2;
      const y = event.clientY - box.top - box.height / 2;
      pull.style.setProperty(
        "--mag-x",
        `${Math.max(-8, Math.min(8, x * 0.2)).toFixed(1)}px`,
      );
      pull.style.setProperty(
        "--mag-y",
        `${Math.max(-6, Math.min(6, y * 0.3)).toFixed(1)}px`,
      );
    }
  };
  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || !finePointer()) return;
    last = event;
    if (!frame) frame = requestAnimationFrame(apply);
  };
  const onLeave = (event: PointerEvent) => {
    if (!event.relatedTarget) release();
  };
  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerout", onLeave);
  window.addEventListener("blur", release);
  return () => {
    cancelAnimationFrame(frame);
    release();
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerout", onLeave);
    window.removeEventListener("blur", release);
  };
}

export function MotionController() {
  const pathname = usePathname();
  const previousPath = useRef<string | null>(null);

  useEffect(pointerEffects, []);

  useEffect(() => {
    // After the first page, content arrives through the page transition, so
    // only what is still below the fold gets a reveal.
    const clientNavigation =
      previousPath.current !== null && previousPath.current !== pathname;
    previousPath.current = pathname;
    const animations = new Set<Animation>();
    const cleanups: (() => void)[] = [scrollspy()];
    const pending = new Set<HTMLElement>();
    const play: Play = (target, keyframes, options) => {
      if (!target) return;
      const animation = target.animate(keyframes, {
        easing: ease.out,
        fill: "backwards",
        ...options,
      });
      animations.add(animation);
      animation.finished
        .then(() => animations.delete(animation))
        .catch(() => {});
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          .forEach((entry, i) => {
            const element = entry.target as HTMLElement;
            observer.unobserve(element);
            pending.delete(element);
            delete element.dataset.revealPending;
            reveal(element, Math.min(i, 4) * 70, play);
          });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    let started = false;
    const start = () => {
      if (started || !motionAllowed()) return;
      started = true;
      const hero = !clientNavigation && document.querySelector(".hero");
      if (hero) heroIntro(play);
      let index = 0;
      document.querySelectorAll<HTMLElement>(REVEAL).forEach((element) => {
        const box = element.getBoundingClientRect();
        if (box.bottom <= 0) return;
        if (box.top < window.innerHeight) {
          if (!clientNavigation)
            reveal(element, 200 + Math.min(index++, 6) * 70, play);
          return;
        }
        element.dataset.revealPending = "";
        pending.add(element);
        observer.observe(element);
      });
    };
    const stop = () => {
      observer.disconnect();
      pending.forEach((element) => delete element.dataset.revealPending);
      pending.clear();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      cleanups.splice(1).forEach((cleanup) => cleanup());
    };
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const onPreference = () => (motionAllowed() ? undefined : stop());

    window.addEventListener(READY_EVENT, start);
    window.addEventListener(MOTION_CHANGE, onPreference);
    preference.addEventListener("change", onPreference);
    if (document.documentElement.dataset.loading !== "pending") start();
    return () => {
      stop();
      cleanups[0]?.();
      window.removeEventListener(READY_EVENT, start);
      window.removeEventListener(MOTION_CHANGE, onPreference);
      preference.removeEventListener("change", onPreference);
    };
  }, [pathname]);

  return null;
}
