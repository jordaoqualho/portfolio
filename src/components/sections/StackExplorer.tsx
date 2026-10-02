"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { StackGroup } from "@/lib/stack";
import { FORWARD } from "@/lib/motion";
import { localePath } from "@/i18n/paths";
import { useLocale, useUi } from "@/i18n/provider";
import styles from "./StackExplorer.module.css";

// Hover or focus previews a technology, click pins it. The panel answers
// "where did you actually use this?" from the same data as the CV.
export function StackExplorer({ groups }: { groups: StackGroup[] }) {
  const t = useUi().stack;
  const locale = useLocale();
  const all = groups.flatMap((g) => g.items);
  const [pinned, setPinned] = useState(all[0].name);
  const [preview, setPreview] = useState<string | null>(null);
  const current = all.find((item) => item.name === (preview ?? pinned))!;


  return (
    <>
      <dl className={`stack-groups ${styles.groups}`}>
        {groups.map((group) => (
          <div key={group.group}>
            <dt>{group.group}</dt>
            <dd onPointerLeave={() => setPreview(null)}>
              {group.items.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className={styles.chip}
                  aria-pressed={item.name === pinned}
                  data-current={item.name === current.name || undefined}
                  onPointerEnter={(e) =>
                    e.pointerType === "mouse" && setPreview(item.name)
                  }
                  onFocus={() => setPreview(item.name)}
                  onBlur={() => setPreview(null)}
                  onClick={() => {
                    setPinned(item.name);
                    setPreview(null);
                  }}
                >
                  {item.name}
                  {item.roles.length > 0 && (
                    <span
                      className={styles.count}
                      aria-label={t.usedIn(item.roles.length)}
                    >
                      {item.roles.length}
                    </span>
                  )}
                </button>
              ))}
            </dd>
          </div>
        ))}
      </dl>

      <aside className={styles.panel} aria-live="polite">
        <div key={current.name} className={styles.panelInner}>
          <p className={styles.name}>{current.name}</p>
          {current.roles.length > 0 ? (
            <>
              <p className={styles.meta}>
                {t.across(
                  t.years(current.years ?? 0),
                  current.roles.length,
                  current.since!,
                )}
              </p>
              <ul className={styles.roles}>
                {current.roles.map((role) => (
                  <li key={role.company}>
                    <span>{role.company}</span>
                    <span>{role.years}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className={styles.meta}>
              {t.noEvidence}
            </p>
          )}
          {current.cases.length > 0 && (
            <ul className={styles.cases} aria-label={t.relatedCases}>
              {current.cases.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={localePath(locale, `/work/${item.slug}/`)}
                    transitionTypes={[FORWARD]}
                  >
                    {item.title}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
