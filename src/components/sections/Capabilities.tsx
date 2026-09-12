import { capabilities } from "@/data/profile";
export function Capabilities() {
  return (
    <section
      className="container capabilities"
      aria-labelledby="capabilities-heading"
    >
      <h2 id="capabilities-heading" className="eyebrow">
        WHERE I CONTRIBUTE
      </h2>
      <div className="capability-grid">
        {capabilities.map((item, i) => (
          <div key={item.title}>
            <span className="capability-number">0{i + 1}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
