import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getContent } from "@/data/content";
import type { Locale } from "@/i18n/config";
import { localeAlternates, ogLocale } from "@/i18n/metadata";
import { localePath } from "@/i18n/paths";
import { ui } from "@/i18n/ui";
import { PageTransition } from "@/components/motion/PageTransition";
import { AnalyticsPreference } from "@/components/privacy/AnalyticsPreference";
import { BACK } from "@/lib/motion";
const descriptions = {
  en: "What jordaoqualho.com collects: PostHog analytics, contact form messages, browser preferences and hosting logs. No accounts or ads.",
  pt: "O que jordaoqualho.com coleta: analytics do PostHog, mensagens do formulário de contato, preferências do navegador e logs de hospedagem. Sem contas ou anúncios.",
};
type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).lang as Locale;
  const title = ui(locale).privacyPage.title;
  const description = descriptions[locale];
  return {
    title,
    description,
    alternates: localeAlternates(locale, "/privacy/", "/privacy.md"),
    openGraph: { ...ogLocale(locale), title, description, url: localePath(locale, "/privacy/") },
  };
}
export default async function PrivacyPage({ params }: Props) {
  const locale = (await params).lang as Locale;
  const t = ui(locale).privacyPage;
  const { privacy } = getContent(locale);
  return (
    <PageTransition>
      <main id="main-content" className="case-detail">
        <div className="container">
          <Link
            href={localePath(locale, "/")}
            className="back-link"
            transitionTypes={[BACK]}
          >
            <ArrowLeft size={16} />
            {t.back}
          </Link>
          <header className="case-detail-header">
            <span className="eyebrow">{t.title.toUpperCase()} / {t.updated} {privacy.updated.toUpperCase()}</span>
            <h1>
              {t.title}
              <span className="accent">.</span>
            </h1>
            <p>{privacy.intro}</p>
          </header>
          <div className="case-detail-grid">
            <aside className="case-index">
              <span className="eyebrow">{t.contents}</span>
              <nav aria-label={t.contentsNav} data-scrollspy>
                {privacy.sections.map((section) => (
                  <a key={section.id} href={`#${section.id}`}>
                    {section.title}
                  </a>
                ))}
              </nav>
            </aside>
            <article className="case-prose">
              {privacy.sections.map((section) => (
                <section key={section.id} id={section.id}>
                  <h2>{section.title}</h2>
                  <p>{section.body}</p>
                  {section.id === "analytics" && <AnalyticsPreference />}
                </section>
              ))}
            </article>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
