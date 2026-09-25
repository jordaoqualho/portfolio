// Shared motion vocabulary: one set of curves keeps every animation feeling related.
export const ease = {
  out: "cubic-bezier(0.16, 1, 0.3, 1)",
  inOut: "cubic-bezier(0.76, 0, 0.24, 1)",
  soft: "cubic-bezier(0.2, 0.7, 0.2, 1)",
};

export const MOTION_CHANGE = "portfolio-motion-change";
export const READY_EVENT = "portfolio-ready";

// Navigation types for page transitions: deeper into a case, or back out of it.
export const FORWARD = "page-forward";
export const BACK = "page-back";

export function motionAllowed() {
  if (typeof window === "undefined") return false;
  return (
    document.documentElement.dataset.motion !== "paused" &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function finePointer() {
  return matchMedia("(hover: hover) and (pointer: fine)").matches;
}

const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·<>_";

// Decodes text in place. Only the existing text node is rewritten, so React
// keeps ownership of the DOM and the final string always matches the markup.
export function scramble(element: Element, duration = 700) {
  const node = element.childNodes.length === 1 ? element.firstChild : null;
  if (!node || node.nodeType !== Node.TEXT_NODE) return () => {};
  const text = node.nodeValue ?? "";
  const start = performance.now();
  let frame = 0;
  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    const settled = Math.floor(progress * text.length);
    let output = text.slice(0, settled);
    for (let i = settled; i < text.length; i++) {
      output += /\s/.test(text[i])
        ? text[i]
        : glyphs[Math.floor(Math.random() * glyphs.length)];
    }
    node.nodeValue = output;
    if (progress < 1) frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(frame);
    node.nodeValue = text;
  };
}
