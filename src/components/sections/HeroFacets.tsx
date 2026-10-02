"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { BookOpen, ChessKnight, Dices, Music, Piano } from "lucide-react";
import { useUi } from "@/i18n/provider";
import { MOTION_CHANGE, motionAllowed } from "@/lib/motion";
import styles from "./HeroFacets.module.css";

type Facet = { id: string; label: string };

const icons: Record<string, typeof Music> = {
  violin: Music,
  theology: BookOpen,
  piano: Piano,
  dm: Dices,
  chess: ChessKnight,
};

const INTERVAL = 3200;

function subscribe(listener: () => void) {
  const query = matchMedia("(prefers-reduced-motion: reduce)");
  window.addEventListener(MOTION_CHANGE, listener);
  query.addEventListener("change", listener);
  return () => {
    window.removeEventListener(MOTION_CHANGE, listener);
    query.removeEventListener("change", listener);
  };
}

// Rotates through the non-engineering sides of me. Auto-advance stops on
// hover, focus, reduced motion or the site's motion toggle; the segments
// below let visitors pick a facet themselves.
export function HeroFacets({ facets }: { facets: Facet[] }) {
  const t = useUi().hero;
  const animate = useSyncExternalStore(subscribe, motionAllowed, () => false);
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const running = animate && !held;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(
      () => setActive((i) => (i + 1) % facets.length),
      INTERVAL,
    );
    return () => window.clearTimeout(id);
  }, [running, active, facets.length]);

  const summary = facets.map((f) => f.label).join(", ");

  return (
    <div
      className={styles.root}
      data-running={running || undefined}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
      style={{ "--facet-interval": `${INTERVAL}ms` } as React.CSSProperties}
    >
      <p className={styles.line}>
        <span className={styles.srOnly}>
          {t.facetsPrefix} {summary}.
        </span>
        <span className={styles.prefix} aria-hidden="true">
          {t.facetsPrefix}
        </span>{" "}
        <span className={styles.stack} aria-hidden="true">
          {facets.map((facet, i) => {
            const Icon = icons[facet.id] ?? Music;
            const state =
              i === active
                ? "active"
                : i === (active - 1 + facets.length) % facets.length
                  ? "prev"
                  : "next";
            return (
              <span key={facet.id} className={styles.item} data-state={state}>
                <Icon className={styles.icon} strokeWidth={1.5} />
                {facet.label}.
              </span>
            );
          })}
        </span>
      </p>
      <div className={styles.segments} role="group" aria-label={t.facetsGroup}>
        {facets.map((facet, i) => (
          <button
            key={facet.id}
            type="button"
            className={styles.segment}
            data-active={i === active || undefined}
            aria-label={`${t.facetShow} ${facet.label}`}
            aria-pressed={i === active}
            onClick={() => setActive(i)}
          >
            <span key={i === active ? active : undefined} />
          </button>
        ))}
      </div>
    </div>
  );
}
