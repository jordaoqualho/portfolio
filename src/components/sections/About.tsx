import { about, principles, profile } from "@/data/profile";
export function About() {
  return (
    <section id="about" className="container section about-section">
      <div className="editorial-grid">
        <div className="section-heading">
          <div>
            <h2>
              Based in Brazil.
              <br />
              Working in English<span className="accent">.</span>
            </h2>
          </div>
        </div>
        <div className="about-copy">
          {about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="profile-languages">{profile.languages}</p>
        </div>
      </div>
      <div className="principles editorial-grid">
        <h3>How I work</h3>
        <ol>
          {principles.map((principle, i) => (
            <li key={principle.title}>
              <span>0{i + 1}</span>
              <div>
                <p>{principle.title}</p>
                <p className="principle-detail">{principle.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
