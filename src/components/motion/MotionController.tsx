"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  ease,
  finePointer,
  motionAllowed,
  MOTION_CHANGE,
  READY_EVENT,
  scramble,
} from "@/lib/motion";

type Play = (
  target: Element | null | undefined,
  keyframes: Keyframe[],
  options?: KeyframeAnimationOptions,
) => void;

const LABELS =
  ".section-heading .eyebrow, .capabilities > .eyebrow, .contact-section .container > .eyebrow, .case-detail-header > .eyebrow, .case-index > .eyebrow, .not-found .eyebrow";
const HEADINGS =
  ".section-heading h2, .contact-grid h2, .case-detail-header h1, .not-found h1";
const BLOCKS =
  ".section-heading p, .contact-grid > div > p, .contact-actions, .contact-details, .case-detail-header > p, .case-detail-header > .tech-list, .back-link, .case-index nav, .case-prose section, .case-next, .about-copy > p, .principles h3, .principles li, .not-found p, .not-found .button, .snapshot > div";
const CARDS = ".capability-grid > div";
const CASES = ".case-row";
const ROLES = ".experience-row";
const STACK = ".stack-groups > div";
const REVEAL = [LABELS, HEADINGS, BLOCKS, CARDS, CASES, ROLES, STACK].join(
  ", ",
);

const fadeUp = (distance: number): Keyframe[] => [
  { opacity: 0, transform: `translateY(${distance}px)` },
  { opacity: 1, transform: "translateY(0)" },
];

function reveal(
  element: Element,
  delay: number,
  play: Play,
  stop: (fn: () => void) => void,
) {
  if (element.matches(LABELS)) {
    play(
      element,
      [
        { opacity: 0, transform: "translateX(-8px)" },
        { opacity: 1, transform: "none" },
      ],
      {
        duration: 600,
        delay,
      },
    );
    const timer = setTimeout(() => stop(scramble(element, 650)), delay);
    stop(() => clearTimeout(timer));
  } else if (element.matches(HEADINGS)) {
    // The clip window grows upward while the text rises into it.
    play(
      element,
      [
        {
          clipPath: "inset(100% -0.1em -0.3em -0.1em)",
          transform: "translateY(0.45em)",
        },
        {
          clipPath: "inset(-0.2em -0.1em -0.3em -0.1em)",
          transform: "translateY(0)",
        },
      ],
      { duration: 1000, delay: delay + 60 },
    );
  } else if (element.matches(CARDS)) {
    play(
      element,
      [
        { opacity: 0, transform: "translateY(36px) scale(0.96)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 900, delay },
    );
    play(
      element.querySelector("svg"),
      [
        { opacity: 0, transform: "scale(0.4) rotate(-45deg)" },
        { opacity: 1, transform: "none" },
      ],
      {
        duration: 900,
        delay: delay + 250,
        easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    );
  } else if (element.matches(CASES)) {
    play(element, fadeUp(32), { duration: 900, delay });
    const number = element.querySelector(".case-number");
    if (number) {
      const timer = setTimeout(() => stop(scramble(number, 500)), delay + 150);
      stop(() => clearTimeout(timer));
    }
    element.querySelectorAll(".tech-list li").forEach((chip, i) =>
      play(
        chip,
        [
          { opacity: 0, transform: "translateY(8px) scale(0.9)" },
          { opacity: 1, transform: "none" },
        ],
        {
          duration: 500,
          delay: delay + 420 + i * 45,
        },
      ),
    );
  } else if (element.matches(ROLES)) {
    play(
      element.querySelector(".experience-date"),
      [
        { opacity: 0, transform: "translateX(-24px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 900, delay },
    );
    element
      .querySelectorAll(
        ".experience-content > :not(.tech-list):not(.timeline-node)",
      )
      .forEach((child, i) =>
        play(
          child,
          [
            { opacity: 0, transform: "translateX(24px)" },
            { opacity: 1, transform: "none" },
          ],
          {
            duration: 900,
            delay: delay + 80 + i * 70,
          },
        ),
      );
    element.querySelectorAll(".tech-list li").forEach((chip, i) =>
      play(
        chip,
        [
          { opacity: 0, transform: "scale(0.8)" },
          { opacity: 1, transform: "none" },
        ],
        {
          duration: 500,
          delay: delay + 380 + i * 40,
          easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        },
      ),
    );
  } else if (element.matches(STACK)) {
    play(
      element.querySelector("dt"),
      [
        { opacity: 0, transform: "translateX(-12px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 700, delay },
    );
    element
      .querySelectorAll("dd > span")
      .forEach((item, i) =>
        play(item, fadeUp(10), { duration: 600, delay: delay + 100 + i * 45 }),
      );
  } else {
    play(element, fadeUp(22), { duration: 850, delay });
  }
}

function heroIntro(play: Play, stop: (fn: () => void) => void) {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  hero
    .querySelectorAll(".hero-topline > *")
    .forEach((item, i) =>
      play(item, fadeUp(10), { duration: 800, delay: i * 90 }),
    );
  hero.querySelectorAll(".hero-line > span").forEach((line, i) =>
    play(
      line,
      [{ transform: "translateY(110%) rotate(2deg)" }, { transform: "none" }],
      {
        duration: 1150,
        delay: 120 + i * 120,
      },
    ),
  );
  play(
    hero.querySelector(".hero-title .accent"),
    [
      { opacity: 0, transform: "scale(0)" },
      { opacity: 1, transform: "none" },
    ],
    { duration: 700, delay: 780, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
  );
  hero
    .querySelectorAll(
      ".hero-focus, .hero-description, .core-stack, .hero-ctas > a",
    )
    .forEach((item, i) =>
      play(item, fadeUp(20), { duration: 900, delay: 420 + i * 80 }),
    );
  const stack = hero.querySelector(".core-stack");
  if (stack) {
    const timer = setTimeout(() => stop(scramble(stack, 900)), 600);
    stop(() => clearTimeout(timer));
  }
  const portrait = hero.querySelector("[data-portrait]");
  play(
    portrait,
    [
      { clipPath: "inset(100% 0 0 0 round 5px)" },
      { clipPath: "inset(0 0 0 0 round 5px)" },
    ],
    { duration: 1300, delay: 220, easing: ease.inOut },
  );
  play(
    portrait?.querySelector("img"),
    [{ transform: "scale(1.25)" }, { transform: "none" }],
    {
      duration: 1800,
      delay: 220,
    },
  );
  play(hero.querySelector(".portrait-caption"), fadeUp(8), {
    duration: 700,
    delay: 1000,
  });
  document
    .querySelectorAll(".snapshot > div")
    .forEach((stat, i) =>
      play(stat, fadeUp(16), { duration: 900, delay: 800 + i * 80 }),
    );
}

// Section-aware navigation: a single marker glides to the link of the section in view.
function scrollspy() {
  const cleanups: (() => void)[] = [];
  document.querySelectorAll<HTMLElement>("[data-scrollspy]").forEach((nav) => {
    const links = [...nav.querySelectorAll<HTMLAnchorElement>("a[href*='#']")];
    const sections = links
      .map((link) => document.getElementById(new URL(link.href).hash.slice(1)))
      .filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length) return;
    const visible = new Set<Element>();
    const mark = () => {
      const current = sections.filter((section) => visible.has(section)).at(-1);
      links.forEach((link) => {
        const active = current && link.hash === `#${current.id}`;
        link.toggleAttribute("data-active", Boolean(active));
        if (!active) return;
        nav.style.setProperty("--spy-x", `${link.offsetLeft}px`);
        nav.style.setProperty("--spy-y", `${link.offsetTop}px`);
        nav.style.setProperty("--spy-w", `${link.offsetWidth}px`);
        nav.style.setProperty("--spy-h", `${link.offsetHeight}px`);
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
      links.forEach((link) => link.removeAttribute("data-active"));
    });
  });
  return () => cleanups.forEach((cleanup) => cleanup());
}

const SPOTLIGHT = ".capability-grid > div, .case-row, .experience-row";
const TILT = ".capability-grid > div";
const MAGNETIC =
  ".hero-ctas > a, .contact-actions > a, .case-read, .header-cv, .case-next a";

// Pointer effects are delegated from the document, so they survive navigation.
function pointerEffects() {
  let tilted: HTMLElement | null = null;
  let magnet: HTMLElement | null = null;
  const release = () => {
    tilted?.style.removeProperty("--tilt-x");
    tilted?.style.removeProperty("--tilt-y");
    magnet?.style.removeProperty("--mag-x");
    magnet?.style.removeProperty("--mag-y");
    tilted = magnet = null;
  };
  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || !finePointer()) return;
    const target = event.target instanceof Element ? event.target : null;
    const spot = target?.closest<HTMLElement>(SPOTLIGHT);
    if (spot) {
      const box = spot.getBoundingClientRect();
      spot.style.setProperty("--spot-x", `${event.clientX - box.left}px`);
      spot.style.setProperty("--spot-y", `${event.clientY - box.top}px`);
    }
    if (!motionAllowed()) return release();

    const tilt = target?.closest<HTMLElement>(TILT) ?? null;
    if (tilt !== tilted) {
      tilted?.style.removeProperty("--tilt-x");
      tilted?.style.removeProperty("--tilt-y");
      tilted = tilt;
    }
    if (tilt) {
      const box = tilt.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      tilt.style.setProperty("--tilt-x", `${(-y * 4).toFixed(2)}deg`);
      tilt.style.setProperty("--tilt-y", `${(x * 4).toFixed(2)}deg`);
    }

    const pull = target?.closest<HTMLElement>(MAGNETIC) ?? null;
    if (pull !== magnet) {
      magnet?.style.removeProperty("--mag-x");
      magnet?.style.removeProperty("--mag-y");
      magnet = pull;
    }
    if (pull) {
      const box = pull.getBoundingClientRect();
      const x = event.clientX - box.left - box.width / 2;
      const y = event.clientY - box.top - box.height / 2;
      pull.style.setProperty(
        "--mag-x",
        `${Math.max(-10, Math.min(10, x * 0.22)).toFixed(1)}px`,
      );
      pull.style.setProperty(
        "--mag-y",
        `${Math.max(-7, Math.min(7, y * 0.35)).toFixed(1)}px`,
      );
    }
  };
  const onLeave = (event: PointerEvent) => {
    if (!event.relatedTarget) release();
  };
  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerout", onLeave);
  window.addEventListener("blur", release);
  return () => {
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
    const stopLater = (fn: () => void) => cleanups.push(fn);
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
            reveal(element, i * 85, play, stopLater);
          });
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    let started = false;
    const start = () => {
      if (started || !motionAllowed()) return;
      started = true;
      const hero = !clientNavigation && document.querySelector(".hero");
      if (hero) heroIntro(play, stopLater);
      let index = 0;
      document.querySelectorAll<HTMLElement>(REVEAL).forEach((element) => {
        if (hero && element.matches(".snapshot > div")) return;
        const box = element.getBoundingClientRect();
        if (box.bottom <= 0) return;
        if (box.top < window.innerHeight) {
          if (!clientNavigation)
            reveal(element, 200 + index++ * 80, play, stopLater);
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
