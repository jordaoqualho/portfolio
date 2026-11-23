"use client";

import { useId, useState } from "react";

// The first few tags carry the role; the rest stay in the HTML (for search
// engines and agents) and open behind a "+N" toggle.
const VISIBLE = 6;

export function TechTags({
  items,
  label,
  moreLabel,
  lessLabel,
  lessText,
}: {
  items: string[];
  label: string;
  moreLabel: string;
  lessLabel: string;
  lessText: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const extra = items.length - VISIBLE;

  return (
    <ul id={id} className="tech-list" aria-label={label}>
      {items.map((tech, i) => (
        <li key={tech} hidden={!open && i >= VISIBLE}>
          {tech}
        </li>
      ))}
      {extra > 0 && (
        <li className="tech-toggle-item">
          <button
            type="button"
            className="tech-toggle"
            aria-expanded={open}
            aria-controls={id}
            aria-label={open ? lessLabel : moreLabel}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? lessText : `+${extra}`}
          </button>
        </li>
      )}
    </ul>
  );
}
