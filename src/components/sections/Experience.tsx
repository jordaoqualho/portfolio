import { experience } from "@/data/profile";
export function Experience() {
  return (
    <section id="experience" className="container section experience-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">02 / EXPERIENCE</span>
          <h2>
            Production work. In context<span className="accent">.</span>
          </h2>
        </div>
      </div>
      <div className="timeline">
        {experience.map((role) => (
          <article className="experience-row" key={role.company}>
            <p className="experience-date">{role.dates}</p>
            <div className="experience-content">
              <h3>{role.company}</h3>
              <p className="role-title">{role.title}</p>
              <p className="role-summary">{role.summary}</p>
              {role.note && <p className="role-note">{role.note}</p>}
              <ul className="tech-list" aria-label="Core technologies">
                {role.technologies.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
