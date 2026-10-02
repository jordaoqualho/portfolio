"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { LOCALE_COOKIE, localeMeta, locales, type Locale } from "@/i18n/config";
import { switchLocale } from "@/i18n/paths";
import { useLocale, useUi } from "@/i18n/provider";
import { motionAllowed } from "@/lib/motion";
import {
  applyTheme,
  readThemePreference,
  resolveTheme,
  THEME_CHANGE,
  type ThemePreference,
} from "@/lib/theme";

// Remembered for a year; the proxy honours it over browser language.
function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

// Fades the page out, then loads the other locale (see layout's localeScript).
function leaveTo(url: string) {
  if (!motionAllowed()) return window.location.assign(url);
  try {
    sessionStorage.setItem("locale-switch", "1");
  } catch {}
  document.documentElement.dataset.localeLeaving = "";
  window.setTimeout(() => window.location.assign(url), 240);
}

const themes: { value: ThemePreference; icon: typeof Sun }[] = [
  { value: "system", icon: Monitor },
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
];

function subscribe(listener: () => void) {
  window.addEventListener(THEME_CHANGE, listener);
  return () => window.removeEventListener(THEME_CHANGE, listener);
}

// One header control for language and theme. Language links go to the same
// page in the other locale and remember the choice in a cookie; the theme
// follows the OS until the visitor picks Light or Dark.
export function PreferencesMenu() {
  const t = useUi().preferences;
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const preference = useSyncExternalStore(subscribe, readThemePreference, () => "system");

  // While on "System", follow live OS changes.
  useEffect(() => {
    if (preference !== "system") return;
    const query = matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      document.documentElement.dataset.theme = resolveTheme("system");
    };
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [preference]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const chooseLocale = (target: Locale) => {
    rememberLocale(target);
    setOpen(false);
    // A full load: the other locale is a different root layout. The page
    // fades out first and the next one fades in (see layout's localeScript),
    // so the switch reads as one transition instead of a flash.
    leaveTo(switchLocale(pathname, target) + window.location.hash);
  };

  const Icon = themes.find((theme) => theme.value === preference)?.icon ?? Monitor;

  return (
    <div
      ref={root}
      className="prefs"
      data-open={open || undefined}
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        className="icon-button prefs-trigger"
        aria-label={t.open}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
      >
        <Icon size={17} aria-hidden="true" />
        <span className="prefs-locale" aria-hidden="true">
          {localeMeta[locale].short}
        </span>
      </button>
      <div id={panelId} className="prefs-panel">
        <p className="prefs-label">{t.language}</p>
        <div className="prefs-options">
          {locales.map((value) => (
            <button
              key={value}
              type="button"
              lang={localeMeta[value].lang}
              aria-pressed={value === locale}
              onClick={() => (value === locale ? setOpen(false) : chooseLocale(value))}
            >
              {localeMeta[value].label}
              {value === locale && <Check size={14} aria-hidden="true" />}
            </button>
          ))}
        </div>
        <p className="prefs-label">{t.theme}</p>
        <div className="prefs-options prefs-themes" role="radiogroup" aria-label={t.theme}>
          {themes.map(({ value, icon: ThemeIcon }) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={value === preference}
              onClick={(event) => {
                const box = event.currentTarget.getBoundingClientRect();
                applyTheme(value, { x: box.left + box.width / 2, y: box.top + box.height / 2 });
              }}
            >
              <ThemeIcon size={16} aria-hidden="true" />
              <span>{t[value]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
