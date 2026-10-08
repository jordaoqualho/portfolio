"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { StackEvidenceLabel, StackGroup, StackItem } from "@/lib/stack";
import { FORWARD } from "@/lib/motion";
import { localePath } from "@/i18n/paths";
import { useLocale, useUi } from "@/i18n/provider";
import styles from "./StackExplorer.module.css";

// Hover or focus selects a technology and keeps it selected after the pointer
// leaves. The panel answers "where did you actually use this?" from the same
// data as the CV.
export function StackExplorer({ groups }: { groups: StackGroup[] }) {
  const t = useUi().stack;
  const locale = useLocale();
  const all = groups.flatMap((g) => g.items);
  const [selected, setSelected] = useState(all[0].name);
  const current = all.find((item) => item.name === selected)!;

  const evidenceText = (item: StackItem) => {
    const label: StackEvidenceLabel = item.evidenceLabel;
    switch (label) {
      case "years":
        return t.exactProfessional(item.durationMonths ?? (item.years ?? 0) * 12);
      case "exposure":
        return t.exactExposure(item.durationMonths ?? (item.years ?? 0) * 12);
      case "professional":
        return t.professionalExperience;
      case "project":
        return t.projectExperience;
      case "case":
        return t.caseEvidence;
      default:
        return "";
    }
  };

  const compactEvidence = (item: StackItem) => {
    switch (item.evidenceLabel) {
      case "years":
        return t.compactYears(item.years ?? 0);
      case "exposure":
        return t.compactExposure(item.years ?? 0);
      case "professional":
        return t.rolesCount(item.roles.length);
      case "project":
        return "";
      case "case":
        return t.caseShort;
      default:
        return "";
    }
  };

  return (
    <>
      <dl className={`stack-groups ${styles.groups}`}>
        {groups.map((group) => (
          <div key={group.group}>
            <dt>{group.group}</dt>
            <dd>
              {group.items.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className={styles.chip}
                  aria-label={`${item.name} — ${evidenceText(item)}`}
                  aria-pressed={item.name === selected}
                  data-current={item.name === current.name || undefined}
                  onPointerEnter={(e) =>
                    e.pointerType === "mouse" && setSelected(item.name)
                  }
                  onFocus={() => setSelected(item.name)}
                  onClick={() => setSelected(item.name)}
                >
                  {item.name}
                  {compactEvidence(item) && (
                    <span
                      className={styles.evidenceBadge}
                      data-kind={item.evidenceLabel}
                      aria-hidden="true"
                    >
                      {compactEvidence(item)}
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
          <p className={styles.meta}>
            {evidenceText(current)}
            {current.since !== undefined && current.evidenceLabel !== "project" && current.evidenceLabel !== "case"
              ? ` · ${t.since(current.since)}`
              : null}
          </p>
          {current.roles.length > 0 && (
            <div className={styles.evidenceGroup}>
              <p className={styles.evidenceLabel}>{t.professionalEvidence}</p>
              <ul className={styles.roles}>
                {current.roles.map((role) => (
                  <li key={role.company}>
                    <span>{role.company}</span>
                    <span>{role.years}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {current.cases.length > 0 && (
            <div className={styles.evidenceGroup}>
              <p className={styles.evidenceLabel}>{t.relatedCases}</p>
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
            </div>
          )}
          {current.projects.length > 0 && (
            <div className={styles.evidenceGroup}>
              <p className={styles.evidenceLabel}>{t.relatedProjects}</p>
              <ul className={styles.cases} aria-label={t.relatedProjects}>
                {current.projects.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={localePath(locale, `/projects/${item.slug}/`)}
                      transitionTypes={[FORWARD]}
                    >
                      {item.name}
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
