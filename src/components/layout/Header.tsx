"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Download, Menu, X } from "lucide-react";
import { navigation, profile } from "@/data/profile";
import { BACK } from "@/lib/motion";
import { localePath, stripLocale } from "@/i18n/paths";
import { useLocale, useUi } from "@/i18n/provider";
import { PreferencesMenu } from "./PreferencesMenu";
import { WorkMenu, type WorkMenuItems } from "./WorkMenu";

const navKey = {
  "/#work": "work",
  "/#experience": "experience",
  "/#projects": "projects",
  "/#stack": "stack",
  "/#about": "about",
  "/#agents": "agents",
  "/#contact": "contact",
} as const;

// Work and Projects live in the dropdown on desktop.
const desktopLinks = navigation.filter(
  (item) => item.href !== "/#work" && item.href !== "/#projects",
);

export function Header({ menu }: { menu: WorkMenuItems }) {
  const t = useUi().header;
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  // Section links only leave the page from a case study; there they read as "back".
  const types = stripLocale(usePathname()) === "/" ? undefined : [BACK];
  const label = (href: string) => t.nav[navKey[href as keyof typeof navKey]];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        setOpen(false);
        menuButton.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  useEffect(() => {
    const element = header.current;
    if (!element) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      const progress = max > 0 ? Math.min(scrollY / max, 1) : 0;
      element.style.setProperty("--scroll-progress", progress.toFixed(4));
      element.toggleAttribute("data-scrolled", scrollY > 8);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <header ref={header} className="site-header">
      <span className="header-progress" aria-hidden="true" />
      <div className="container header-inner">
        <Link
          href={localePath(locale, "/")}
          className="wordmark"
          aria-label={t.home}
          transitionTypes={types}
        >
          jq<span>.</span>
        </Link>
        <nav aria-label={t.main} className="desktop-nav" data-scrollspy>
          <WorkMenu items={menu} />
          {desktopLinks.map((item) => (
            <Link
              key={item.href}
              href={localePath(locale, item.href)}
              transitionTypes={types}
            >
              {label(item.href)}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <a
            className="header-resume header-cv"
            href={profile.resumePath}
            download="Jordao_Qualho_Senior_Software_Engineer_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.downloadCv}
            <Download size={14} aria-hidden="true" />
          </a>
          <span className="header-divider" />
          <PreferencesMenu />
          <button
            ref={menuButton}
            className="icon-button mobile-menu-button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? t.closeMenu : t.openMenu}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      <nav
        id="mobile-navigation"
        aria-label={t.mobile}
        className="mobile-nav"
        hidden={!open}
      >
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={localePath(locale, item.href)}
            transitionTypes={types}
            onClick={() => setOpen(false)}
          >
            {label(item.href)}
            <ArrowUpRight size={16} />
          </Link>
        ))}
      </nav>
    </header>
  );
}
