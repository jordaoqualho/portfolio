"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { BACK, FORWARD } from "@/lib/motion";
import { localePath, stripLocale } from "@/i18n/paths";
import { useLocale, useUi } from "@/i18n/provider";

export type WorkMenuItems = {
  cases: { href: string; category: string; title: string }[];
  projects: { href: string; name: string; line: string }[];
};

type Item = { href: string; title: string; detail: string; projectName?: string };

// A label opens a concise preview of its content. The final row deliberately
// remains a real section link, separating "show the menu" from "go to this
// section" for mouse, keyboard and touch users.
function SectionMenu({
  label,
  heading,
  sectionHref,
  sectionLabel,
  spyFor,
  items,
}: {
  label: string;
  heading: string;
  sectionHref: string;
  sectionLabel: string;
  spyFor: string;
  items: Item[];
}) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const timer = useRef<number>(0);
  const panelId = useId();
  const pathname = usePathname();
  const back = stripLocale(pathname) === "/" ? undefined : [BACK];

  const schedule = (next: boolean, delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(next), delay);
  };

  const [shownOn, setShownOn] = useState(pathname);
  if (shownOn !== pathname) {
    setShownOn(pathname);
    setOpen(false);
  }

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

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const focusFirst = () =>
    requestAnimationFrame(() =>
      root.current?.querySelector<HTMLAnchorElement>(".work-menu-panel a")?.focus(),
    );

  return (
    <div
      ref={root}
      className="work-menu"
      data-open={open || undefined}
      onPointerEnter={(event) => event.pointerType === "mouse" && schedule(true, 90)}
      onPointerLeave={(event) => event.pointerType === "mouse" && schedule(false, 180)}
      onBlur={(event) => {
        if (!root.current?.contains(event.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        className="work-menu-trigger"
        data-spy-for={spyFor}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          window.clearTimeout(timer.current);
          setOpen(!open);
        }}
        onKeyDown={(event) => {
          if (event.key !== "ArrowDown") return;
          event.preventDefault();
          setOpen(true);
          focusFirst();
        }}
      >
        {label}
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      <div id={panelId} className="work-menu-panel work-menu-panel-cases">
        <div className="work-menu-column">
          <p className="work-menu-label">{heading}</p>
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  className={item.projectName ? "work-menu-project" : undefined}
                  href={item.href}
                  transitionTypes={[FORWARD]}
                  onClick={() => setOpen(false)}
                >
                  {item.projectName ? (
                    <>
                      <span className="work-menu-title">{item.title}</span>
                      <span className="work-menu-meta">{item.detail}</span>
                    </>
                  ) : (
                    <>
                      <span className="work-menu-meta">{item.detail}</span>
                      <span className="work-menu-title">{item.title}</span>
                    </>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            className="work-menu-all"
            href={localePath(locale, sectionHref)}
            transitionTypes={back}
            onClick={() => setOpen(false)}
          >
            {sectionLabel} <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function WorkMenu({ items }: { items: WorkMenuItems }) {
  const t = useUi().workMenu;
  return (
    <SectionMenu
      label={t.trigger}
      heading={t.cases}
      sectionHref="/#work"
      sectionLabel={t.allCases}
      spyFor="work"
      items={items.cases.map((item) => ({
        href: item.href,
        title: item.title,
        detail: item.category,
      }))}
    />
  );
}

export function ProjectMenu({ items }: { items: WorkMenuItems }) {
  const t = useUi().workMenu;
  return (
    <SectionMenu
      label={t.projects}
      heading={t.projects}
      sectionHref="/#projects"
      sectionLabel={t.allProjects}
      spyFor="projects"
      items={items.projects.map((item) => ({
        href: item.href,
        title: item.name,
        detail: item.line,
        projectName: item.name,
      }))}
    />
  );
}
