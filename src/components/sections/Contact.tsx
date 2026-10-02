import { getContent } from "@/data/content";
import { ContactAlternatives } from "@/components/contact/ContactAlternatives";
import { ContactForm } from "@/components/contact/ContactForm";
import type { Locale } from "@/i18n/config";
import { ui } from "@/i18n/ui";
export function Contact({ locale }: { locale: Locale }) {
  const { contact, profile } = getContent(locale);
  const t = ui(locale);
  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="contact-grid contact-layout">
          <div className="contact-intro">
            <h2>{contact.title}</h2>
            <p>{contact.description}</p>
            <div className="contact-details">
              <span className="availability">
                <span />
                {profile.availability}
              </span>
              <p>{t.contact.timezone}</p>
            </div>
          </div>
          <div className="contact-panel">
            <ContactForm email={profile.email} />
            <ContactAlternatives
              email={profile.email}
              linkedin={profile.linkedin}
              whatsapp={profile.whatsapp}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
