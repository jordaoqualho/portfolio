"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useUi } from "@/i18n/provider";
import { localePath } from "@/i18n/paths";
import { FORWARD, motionAllowed } from "@/lib/motion";
import styles from "./ProofStrip.module.css";

// Counts each number up once when the strip enters view. The final value is
// in the markup, so no-JS, reduced motion and crawlers see the real figure.
function useCountUp(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root || !motionAllowed()) return;
    const numbers = [...root.querySelectorAll<HTMLElement>("[data-count]")];
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / 1400, 1);
          const eased = 1 - Math.pow(1 - t, 4);
          numbers.forEach((el) => {
            el.textContent = String(Math.round(Number(el.dataset.count) * eased));
          });
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(root);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [ref]);
}

type Stat = { value: number; suffix: string; label: string; detail: string; href: string };

export function ProofStrip({ stats }: { stats: Stat[] }) {
  const t = useUi().hero;
  const locale = useLocale();
  const ref = useRef<HTMLElement>(null);
  useCountUp(ref);
  return (
    <section ref={ref} className={`container ${styles.strip}`} aria-label={t.proof}>
      {stats.map((stat) => (
        <Link
          key={stat.label}
          href={localePath(locale, stat.href)}
          className={styles.item}
          transitionTypes={stat.href.startsWith("/work") ? [FORWARD] : undefined}
        >
          <span className={styles.value}>
            <span data-count={stat.value}>{stat.value}</span>
            <span className={styles.suffix}>{stat.suffix}</span>
          </span>
          <span className={styles.label}>{stat.label}</span>
          <span className={styles.detail}>
            {stat.detail}
            <ArrowUpRight size={13} aria-hidden="true" />
          </span>
        </Link>
      ))}
    </section>
  );
}
