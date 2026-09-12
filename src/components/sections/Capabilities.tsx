import { capabilities } from "@/data/profile";
import { Activity, Cloud, PanelsTopLeft, Server } from "lucide-react";
import styles from "./Capabilities.module.css";

const capabilityIcons = [Server, PanelsTopLeft, Activity, Cloud];

export function Capabilities() {
  return (
    <section
      className="container capabilities"
      aria-labelledby="capabilities-heading"
    >
      <h2 id="capabilities-heading" className="eyebrow">
        WHERE I CONTRIBUTE
      </h2>
      <div className={`capability-grid ${styles.grid}`}>
        {capabilities.map((item, i) => {
          const Icon = capabilityIcons[i] ?? Server;
          return (
            <div className={styles.card} key={item.title}>
              <div className={styles.meta} aria-hidden="true">
                <span className={styles.icon}><Icon size={23} strokeWidth={1.5} /></span>
                <span className={styles.number}>0{i + 1}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
