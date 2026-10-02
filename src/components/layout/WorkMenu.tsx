"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cases, projects } from "@/data/profile";
import { BACK, FORWARD } from "@/lib/motion";

const featured = projects.filter((p) => p.slug || p.href);
const projectHref = (p: (typeof projects)[number]) =>
  p.slug ? `/projects/${p.slug}/` : p.href!;

// "Work" in the header: one trigger for the engineering cases and side
// projects, with direct links to every page. Hover opens it with a short
// intent delay; click and keyboard work the same way.
export function WorkMenu() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const timer = useRef<number>(0);
  const panelId = useId();
  const pathname = usePathname();
  const back = pathname === "/" ? undefined : [BACK];

  const schedule = (next: boolean, delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(next), delay);
  };

  // Close on navigation, adjusted during render rather than in an effect.
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
      onPointerEnter={(e) => e.pointerType === "mouse" && schedule(true, 90)}
      onPointerLeave={(e) => e.pointerType === "mouse" && schedule(false, 180)}
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        className="work-menu-trigger"
        data-spy-for="work projects"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          window.clearTimeout(timer.current);
          setOpen(!open);
        }}
        onKeyDown={(e) => {
          if (e.key !== "ArrowDown") return;
          e.preventDefault();
          setOpen(true);
          focusFirst();
        }}
      >
        Work
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      <div id={panelId} className="work-menu-panel">
        <div className="work-menu-column">
          <p className="work-menu-label">Engineering cases</p>
          <ul>
            {cases.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/work/${item.slug}/`}
                  transitionTypes={[FORWARD]}
                  onClick={() => setOpen(false)}
                >
                  <span className="work-menu-meta">{item.category}</span>
                  <span className="work-menu-title">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            className="work-menu-all"
            href="/#work"
            transitionTypes={back}
            onClick={() => setOpen(false)}
          >
            All cases <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
        <div className="work-menu-column">
          <p className="work-menu-label">Side projects</p>
          <ul>
            {featured.map((project) => (
              <li key={project.name}>
                <Link
                  href={projectHref(project)}
                  transitionTypes={[FORWARD]}
                  onClick={() => setOpen(false)}
                >
                  <span className="work-menu-title">{project.name}</span>
                  <span className="work-menu-meta">
                    {project.detail?.tagline ?? project.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            className="work-menu-all"
            href="/#projects"
            transitionTypes={back}
            onClick={() => setOpen(false)}
          >
            All projects <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
