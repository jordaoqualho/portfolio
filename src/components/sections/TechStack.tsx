import { skills } from "@/data/profile";
export function TechStack() {
  return (
    <section id="stack" className="stack-section section">
      <div className="container editorial-grid">
        <div className="section-heading">
          <div>
            <span className="eyebrow">03 / TECHNICAL STACK</span>
            <h2>
              Tools I work with<span className="accent">.</span>
            </h2>
          </div>
        </div>
        <dl className="stack-groups">
          {skills.map((group) => (
            <div key={group.group}>
              <dt>{group.group}</dt>
              <dd>
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
