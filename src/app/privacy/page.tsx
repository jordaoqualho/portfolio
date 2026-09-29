import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { privacy } from "@/data/privacy";
import { PageTransition } from "@/components/motion/PageTransition";
import { BACK } from "@/lib/motion";
const description =
  "What jordaoqualho.com collects: PostHog analytics, browser preferences and hosting logs. No accounts, forms or ads.";
export const metadata: Metadata = {
  title: "Privacy",
  description,
  alternates: {
    canonical: "/privacy/",
    types: { "text/markdown": "/privacy.md" },
  },
  openGraph: { title: "Privacy", description, url: "/privacy/" },
};
export default function PrivacyPage() {
  return (
    <PageTransition>
      <main id="main-content" className="case-detail">
        <div className="container">
          <Link href="/" className="back-link" transitionTypes={[BACK]}>
            <ArrowLeft size={16} />
            Back to profile
          </Link>
          <header className="case-detail-header">
            <span className="eyebrow">PRIVACY / UPDATED {privacy.updated}</span>
            <h1>
              Privacy<span className="accent">.</span>
            </h1>
            <p>{privacy.intro}</p>
          </header>
          <div className="case-detail-grid">
            <aside className="case-index">
              <span className="eyebrow">ON THIS PAGE</span>
              <nav aria-label="Page contents" data-scrollspy>
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
                </section>
              ))}
            </article>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
