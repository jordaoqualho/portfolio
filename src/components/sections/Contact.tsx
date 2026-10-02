import { ArrowUpRight, Mail } from "lucide-react";
import { contact, profile } from "@/data/profile";
export function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="contact-grid">
          <div>
            <h2>{contact.title}</h2>
            <p>{contact.description}</p>
            <div className="contact-actions">
              <a className="button primary" href={`mailto:${profile.email}`}>
                <Mail size={16} />
                Let’s talk
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
            </div>
          </div>
          <div className="contact-details">
            <span className="availability">
              <span />
              {profile.availability}
            </span>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <p>Brazil (UTC−3) · LATAM · International teams</p>
          </div>
        </div>
      </div>
    </section>
  );
}
