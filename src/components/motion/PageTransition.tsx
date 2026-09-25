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

const DURATION = 900;

// Scaling a full page snapshot around its own centre would push the visible
// visible part up or down, so the origin is moved to the middle of the viewport.
function viewportOrigin(group: Pseudo) {
  try {
    const top = new DOMMatrixReadOnly(group.getComputedStyle().transform).m42;
    return `50% ${window.innerHeight / 2 - top}px`;
  } catch {
    return "50% 50%";
  }
}

const recede = (origin: string): Keyframe[] => [
  { transform: "none", opacity: 1, transformOrigin: origin },
  {
    transform: "translateY(-3vh) scale(0.93)",
    opacity: 0.25,
    transformOrigin: origin,
  },
];
// Rounded top edge and shadow make the incoming page read as a sheet on top.
const sheet = (): Keyframe[] => [
  {
    transform: `translateY(${window.innerHeight}px)`,
    borderRadius: "28px 28px 0 0",
    boxShadow: "0 -24px 60px rgb(0 0 0 / 0.14)",
  },
  { transform: "none", borderRadius: "0", boxShadow: "0 0 0 rgb(0 0 0 / 0)" },
];
const sheetEase = "cubic-bezier(0.22, 1, 0.36, 1)";

function onExit(viewTransition: ViewTransitionInstance, types: string[]) {
  if (!motionAllowed()) return;
  const { old, group } = viewTransition as Instance;
  const animation = types.includes(BACK)
    ? old.animate(sheet().reverse(), {
        duration: DURATION * 0.85,
        easing: ease.inOut,
        fill: "both",
      })
    : types.includes(FORWARD)
      ? old.animate(recede(viewportOrigin(group)), {
          duration: DURATION,
          easing: ease.inOut,
          fill: "both",
        })
      : old.animate(
          [{ opacity: 1 }, { opacity: 0, transform: "translateY(-12px)" }],
          { duration: 260, easing: ease.soft, fill: "both" },
        );
  return () => animation.cancel();
}

function onEnter(viewTransition: ViewTransitionInstance, types: string[]) {
  if (!motionAllowed()) return;
  const { new: next, group } = viewTransition as Instance;
  const animation = types.includes(FORWARD)
    ? next.animate(sheet(), {
        duration: DURATION * 1.1,
        delay: 60,
        easing: sheetEase,
        fill: "both",
      })
    : types.includes(BACK)
      ? next.animate(recede(viewportOrigin(group)).reverse(), {
          duration: DURATION,
          easing: ease.out,
          fill: "both",
        })
      : next.animate(
          [
            { opacity: 0, transform: "translateY(16px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 480, delay: 160, easing: ease.out, fill: "both" },
        );
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
