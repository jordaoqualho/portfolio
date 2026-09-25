"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowUpRight, Download, Menu, Moon, Sun, X } from "lucide-react";
import { navigation, profile } from "@/data/profile";
import { BACK, ease, motionAllowed } from "@/lib/motion";
export function Header() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  // Section links only leave the page from a case study; there they read as "back".
  const types = usePathname() === "/" ? undefined : [BACK];
  function toggleTheme(event: MouseEvent<HTMLButtonElement>) {
    const root = document.documentElement;
    const dark = root.dataset.theme !== "dark";
    const apply = () => {
      root.dataset.theme = dark ? "dark" : "light";
      try {
        localStorage.setItem("theme", dark ? "dark" : "light");
      } catch {}
    };
    if (!document.startViewTransition || !motionAllowed()) return apply();
    // The new theme spreads out from the toggle as a growing circle.
    const box = event.currentTarget.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    const radius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    );
    root.dataset.themeSwitching = "";
    const transition = document.startViewTransition(apply);
    transition.ready
      .then(() =>
        root.animate(
          {
            clipPath: [
              `circle(0 at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 750,
            easing: ease.inOut,
            pseudoElement: "::view-transition-new(root)",
          },
        ),
      )
      .catch(() => {});
    transition.finished.finally(() => delete root.dataset.themeSwitching);
  }
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
          href="/"
          className="wordmark"
          aria-label="Jordão Qualho home"
          transitionTypes={types}
        >
          jq<span>.</span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="desktop-nav"
          data-scrollspy
        >
          {navigation.map((item) => (
            <Link key={item.label} href={item.href} transitionTypes={types}>
              {item.label}
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
            Download CV
            <Download size={14} aria-hidden="true" />
          </a>
          <span className="header-divider" />
          <button
            className="icon-button theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
          >
            <Sun className="sun-icon" size={18} />
            <Moon className="moon-icon" size={18} />
          </button>
          <button
            ref={menuButton}
            className="icon-button mobile-menu-button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        className="mobile-nav"
        hidden={!open}
      >
        {navigation.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            transitionTypes={types}
            onClick={() => setOpen(false)}
          >
            {item.label}
            <ArrowUpRight size={16} />
          </Link>
        ))}
      </nav>
    </header>
  );
}
