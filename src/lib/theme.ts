import { ease, motionAllowed } from "./motion";

export type ThemePreference = "system" | "light" | "dark";
export const THEME_CHANGE = "portfolio-theme-change";

const systemDark = () => matchMedia("(prefers-color-scheme: dark)").matches;

export function readThemePreference(): ThemePreference {
  try {
    const stored = localStorage.getItem("theme");
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

export const resolveTheme = (preference: ThemePreference) =>
  preference === "system" ? (systemDark() ? "dark" : "light") : preference;

// Stores the preference and paints the resolved theme. When the visible theme
// changes and motion is allowed, the new theme spreads from `origin` as a circle.
export function applyTheme(preference: ThemePreference, origin?: { x: number; y: number }) {
  const root = document.documentElement;
  try {
    if (preference === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", preference);
  } catch {}
  const next = resolveTheme(preference);
  window.dispatchEvent(new Event(THEME_CHANGE));
  if (root.dataset.theme === next) return;
  const paint = () => {
    root.dataset.theme = next;
  };
  if (!origin || !document.startViewTransition || !motionAllowed()) return paint();
  const { x, y } = origin;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  root.dataset.themeSwitching = "";
  const transition = document.startViewTransition(paint);
  transition.ready
    .then(() =>
      root.animate(
        { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 750, easing: ease.inOut, pseudoElement: "::view-transition-new(root)" },
      ),
    )
    .catch(() => {});
  transition.finished.finally(() => delete root.dataset.themeSwitching);
}
