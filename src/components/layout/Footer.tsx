import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MotionPreferences } from "./MotionPreferences";
import { profile } from "@/data/profile";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import { ui } from "@/i18n/ui";
export function Footer({ locale }: { locale: Locale }) {
  const t = ui(locale).footer;
  return (
    <footer className="container footer">
      <p>
        © {new Date().getFullYear()} {profile.name}
      </p>
      <span>{t.location}</span>
      <MotionPreferences />
      <nav aria-label={t.nav} className="footer-links">
        <Link href="/agents/">{t.agents}</Link>
        <Link href="/developers/">{t.developers}</Link>
        <Link href={localePath(locale, "/privacy/")}>{t.privacy}</Link>
        <a href={profile.github} target="_blank" rel="noopener noreferrer">
          GitHub <ArrowUpRight size={14} />
        </a>
      </nav>
    </footer>
  );
}
