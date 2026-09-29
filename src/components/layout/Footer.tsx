import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MotionPreferences } from "./MotionPreferences";
import { profile } from "@/data/profile";
export function Footer() {
  return (
    <footer className="container footer">
      <p>
        © {new Date().getFullYear()} {profile.name}
      </p>
      <span>Brazil · Remote international</span>
      <MotionPreferences />
      <nav aria-label="Footer" className="footer-links">
        <Link href="/agents/">For AI agents</Link>
        <Link href="/privacy/">Privacy</Link>
        <a href={profile.github} target="_blank" rel="noopener noreferrer">
          GitHub <ArrowUpRight size={14} />
        </a>
      </nav>
    </footer>
  );
}
