"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { navigation, profile } from "@/data/profile";
export function Header() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  function toggleTheme() {
    const dark = document.documentElement.dataset.theme !== "dark";
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
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
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="wordmark" aria-label="Jordão Qualho home">
          jq<span>.</span>
        </Link>
        <nav aria-label="Main navigation" className="desktop-nav">
          {navigation.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <a
            className="header-resume"
            href={
              profile.resumePath ||
              `mailto:${profile.email}?subject=Resume%20request`
            }
            target={profile.resumePath ? "_blank" : undefined}
            rel="noopener noreferrer"
          >
            {profile.resumePath ? "Resume" : "Request resume"}
            <ArrowUpRight size={14} />
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
