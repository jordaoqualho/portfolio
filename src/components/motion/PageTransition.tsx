"use client";

import {
  ViewTransition,
  type ReactNode,
  type ViewTransitionInstance,
} from "react";
import { BACK, ease, FORWARD, motionAllowed } from "@/lib/motion";

type Pseudo = {
  animate(keyframes: Keyframe[], options: KeyframeAnimationOptions): Animation;
  getComputedStyle(): CSSStyleDeclaration;
};
// React's runtime exposes the pseudo-elements; the public types only list `name`.
type Instance = ViewTransitionInstance & {
  group: Pseudo;
  old: Pseudo;
  new: Pseudo;
};

// Short and small: the old page settles back while the new one rises a few
// pixels into place. Only transform and opacity animate, so the snapshots stay
// on the compositor and the transition does not drop frames on long pages.
const OUT = 360;
const IN = 560;

// Scaling a full page snapshot around its own centre would push the visible
// part up or down, so the origin is moved to the middle of the viewport.
function viewportOrigin(group: Pseudo) {
  try {
    const top = new DOMMatrixReadOnly(group.getComputedStyle().transform).m42;
    return `50% ${window.innerHeight / 2 - top}px`;
  } catch {
    return "50% 50%";
  }
}

const settle = (origin: string): Keyframe[] => [
  { transform: "none", opacity: 1, transformOrigin: origin },
  { transform: "scale(0.97)", opacity: 0, transformOrigin: origin },
];
const rise = (distance: number): Keyframe[] => [
  { transform: `translateY(${distance}px)`, opacity: 0 },
  { transform: "none", opacity: 1 },
];

function onExit(viewTransition: ViewTransitionInstance, types: string[]) {
  if (!motionAllowed()) return;
  const { old, group } = viewTransition as Instance;
  const animation = types.includes(FORWARD)
    ? old.animate(settle(viewportOrigin(group)), {
        duration: OUT,
        easing: ease.inOut,
        fill: "both",
      })
    : types.includes(BACK)
      ? old.animate(rise(40).reverse(), {
          duration: OUT,
          easing: ease.inOut,
          fill: "both",
        })
      : old.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 220,
          easing: ease.soft,
          fill: "both",
        });
  return () => animation.cancel();
}

function onEnter(viewTransition: ViewTransitionInstance, types: string[]) {
  if (!motionAllowed()) return;
  const { new: next, group } = viewTransition as Instance;
  const animation = types.includes(FORWARD)
    ? next.animate(rise(56), {
        duration: IN,
        delay: 120,
        easing: ease.out,
        fill: "both",
      })
    : types.includes(BACK)
      ? next.animate(settle(viewportOrigin(group)).reverse(), {
          duration: IN,
          delay: 100,
          easing: ease.out,
          fill: "both",
        })
      : next.animate(rise(12), {
          duration: 420,
          delay: 120,
          easing: ease.out,
          fill: "both",
        });
  return () => animation.cancel();
}

const exitClass = {
  [FORWARD]: "page-out-forward",
  [BACK]: "page-out-back",
  default: "page-out",
};
const enterClass = {
  [FORWARD]: "page-in-forward",
  [BACK]: "page-in-back",
  default: "page-in",
};

// Wraps a page's <main>. Layouts persist across navigations, so this belongs in
// each page rather than the root layout.
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={enterClass}
      exit={exitClass}
      default="none"
      onEnter={onEnter}
      onExit={onExit}
    >
      {children}
    </ViewTransition>
  );
}
