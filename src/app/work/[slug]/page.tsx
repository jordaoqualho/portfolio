import type { Metadata } from "next";
import { ViewTransition } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { cases, profile } from "@/data/profile";
import { PageTransition } from "@/components/motion/PageTransition";
import { BACK, FORWARD } from "@/lib/motion";
export const dynamicParams = false;
export function generateStaticParams() {
  return cases.map((item) => ({ slug: item.slug }));
}
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = cases.find((item) => item.slug === slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.summary,
    alternates: {
      canonical: `/work/${slug}/`,
      types: { "text/markdown": `/work/${slug}.md` },
    },
    openGraph: {
      title: item.title,
      description: item.summary,
      url: `/work/${slug}/`,
      type: "article",
    },
    twitter: {
      title: item.title,
      description: item.summary,
      card: "summary_large_image",
    },
  };
}
export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const item = cases.find((item) => item.slug === slug);
  if (!item) notFound();
  const nextCase = cases[(cases.indexOf(item) + 1) % cases.length];
  return (
    <PageTransition key={slug}>
      <main id="main-content" className="case-detail">
        <div className="container">
          <Link href="/#work" className="back-link" transitionTypes={[BACK]}>
            <ArrowLeft size={16} />
            All engineering cases
          </Link>
          <header className="case-detail-header">
            <span className="eyebrow">
              CASE {item.number} / {item.category}
            </span>
            <ViewTransition
              name={`case-${item.slug}`}
              share="case-morph"
              default="none"
            >
              <h1>
                {item.title}
                <span className="accent">.</span>
              </h1>
            </ViewTransition>
            <p>{item.summary}</p>
            <ul className="tech-list" aria-label="Technologies">
              {item.technologies.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </header>
          <div className="case-detail-grid">
            <aside className="case-index">
              <span className="eyebrow">IN THIS CASE</span>
              <nav aria-label="Case contents" data-scrollspy>
                {item.sections.map((section) => (
                  <a key={section.id} href={`#${section.id}`}>
                    {section.heading}
                  </a>
                ))}
              </nav>
            </aside>
            <article className="case-prose">
              {item.sections.map((section) => {
                const List = section.ordered ? "ol" : "ul";
                const className =
                  section.id === "result"
                    ? "outcome-panel"
                    : section.id === "takeaway"
                      ? "takeaway"
                      : undefined;
                return (
                  <section
                    key={section.id}
                    id={section.id}
                    className={className}
                  >
                    <h2>{section.heading}</h2>
                    {section.body &&
                      (section.id === "takeaway" ? (
                        <blockquote>{section.body}</blockquote>
                      ) : (
                        <p>{section.body}</p>
                      ))}
                    {section.points && (
                      <List>
                        {section.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </List>
                    )}
                  </section>
                );
              })}
            </article>
          </div>
          <div className="case-next">
            <div>
              <span className="eyebrow">NEXT CASE / {nextCase.number}</span>
              <Link
                href={`/work/${nextCase.slug}/`}
                transitionTypes={[FORWARD]}
              >
                {nextCase.title}
                <ArrowUpRight size={23} />
              </Link>
            </div>
            <a className="text-link" href={`mailto:${profile.email}`}>
              Discuss my experience
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
