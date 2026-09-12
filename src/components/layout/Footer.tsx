import { ArrowUpRight } from "lucide-react";
import { MotionPreferences } from "./MotionPreferences";
import { profile } from "@/data/profile";
export function Footer() {
  return (
    <footer className="container footer">
      <p>
        © {new Date().getFullYear()} {profile.name}
      </p>
      <span>Brazil · Working across borders</span>
      <MotionPreferences />
      <a href={profile.github} target="_blank" rel="noopener noreferrer">
        GitHub <ArrowUpRight size={14} />
      </a>
    </footer>
  );
}
