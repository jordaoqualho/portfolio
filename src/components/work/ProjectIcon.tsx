import { Bot, BrainCircuit, Folder, Skull, Swords, Wallet } from "lucide-react";

// One mark per project, drawn from the site's icon set and tinted with the
// accent, so the list reads as a family instead of a row of text cards.
const icons: Record<string, typeof Folder> = {
  iMemory: BrainCircuit,
  Roundkeep: Swords,
  Deadfolio: Skull,
  Fintal: Wallet,
  "Agent-readable portfolio": Bot,
};

export function ProjectIcon({
  name,
  size = 20,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Icon = icons[name] ?? Folder;
  return (
    <span className={`project-icon ${className}`} aria-hidden="true">
      <Icon size={size} strokeWidth={1.6} />
    </span>
  );
}
