import { ArrowUpRight, Mail } from "lucide-react";
import { contact, profile } from "@/data/profile";
export function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <span className="eyebrow">05 / LET’S TALK</span>
        <div className="contact-grid">
          <div>
            <h2>{contact.title}</h2>
            <p>{contact.description}</p>
            <div className="contact-actions">
              <a className="button primary" href={`mailto:${profile.email}`}>
                <Mail size={16} />
                Email me
                <ArrowUpRight size={16} />
              </a>
              <a
                className="button secondary"
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
                <ArrowUpRight size={16} />
              </a>
              <a
                className="text-link"
                href={profile.resumePath}
                download="Jordao_Qualho_Senior_Software_Engineer_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
          <div className="contact-details">
            <span className="availability">
              <span />
              Open to remote opportunities
            </span>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <p>Brazil · LATAM · International teams</p>
          </div>
        </div>
      </div>
    </section>
  );
}
