"use client";

import { ArrowUpRight, Linkedin, Mail, MessageCircle } from "lucide-react";
import { useUi } from "@/i18n/provider";
import { track } from "@/lib/analytics";

// Secondary channels under the form. WhatsApp is framed for project and
// consulting enquiries, not recruiting, and opens with a prefilled message.
export function ContactAlternatives({
  email,
  linkedin,
  whatsapp,
}: {
  email: string;
  linkedin: string;
  whatsapp: string;
}) {
  const t = useUi().contactForm;
  const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(t.whatsappMessage)}`;
  return (
    <div className="contact-alternatives">
      <p>
        <span>{t.or}</span>
        <a href={`mailto:${email}`} onClick={() => track("contact_email_clicked")}>
          <Mail size={14} aria-hidden="true" /> {t.emailLink}
        </a>
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("contact_linkedin_clicked")}
        >
          <Linkedin size={14} aria-hidden="true" /> {t.linkedinLink}
        </a>
      </p>
      <p className="contact-whatsapp">
        <span>{t.whatsappPrompt}</span>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("contact_whatsapp_clicked")}
        >
          <MessageCircle size={14} aria-hidden="true" /> {t.whatsappLink}
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </p>
    </div>
  );
}
