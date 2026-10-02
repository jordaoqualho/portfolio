import { stackEvidence } from "@/lib/stack";
import { StackExplorer } from "./StackExplorer";
export function TechStack() {
  return (
    <section id="stack" className="stack-section section">
      <div className="container stack-layout">
        <div className="section-heading">
          <div>
            <h2>
              What I use in production<span className="accent">.</span>
            </h2>
            <p>Pick a technology to see where I used it.</p>
          </div>
        </div>
        <StackExplorer groups={stackEvidence()} />
      </div>
    </section>
  );
}
