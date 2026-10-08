import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { projects } from "@/data/profile";
import { getContent } from "@/data/content";
import type { Locale } from "@/i18n/config";
import { localeAlternates, ogLocale } from "@/i18n/metadata";
import { localePath } from "@/i18n/paths";
import { ui } from "@/i18n/ui";
import { PageTransition } from "@/components/motion/PageTransition";
import { BACK, FORWARD } from "@/lib/motion";
export const dynamicParams = false;
const detailed = projects.filter((p) => p.slug && p.detail);
export function generateStaticParams() {
  return detailed.map((project) => ({ slug: project.slug! }));
}
type Props = { params: Promise<{ lang: string; slug: string }> };
const localized = (locale: Locale) =>
  getContent(locale).projects.filter((p) => p.slug && p.detail);

type LayerKey = "interface" | "runtime" | "data" | "delivery";
const layerRules: { key: LayerKey; technologies: string[] }[] = [
  {
    key: "interface",
    technologies: [
      "React",
      "Next.js",
      "Vite",
      "Vue.js",
      "Tailwind CSS",
      "GSAP",
    ],
  },
  {
    key: "runtime",
    technologies: [
      "Node.js",
      "Fastify",
      "NestJS",
      "Socket.IO",
      "MCP",
      "REST APIs",
    ],
  },
  {
    key: "data",
    technologies: [
      "PostgreSQL",
      "Vercel Blob",
      "DynamoDB",
      "MongoDB",
      "Redis",
      "Firestore",
      "PostHog",
    ],
  },
  {
    key: "delivery",
    technologies: [
      "Vercel",
      "PWA",
      "Service Worker",
      "AWS",
      "Google Cloud Platform",
      "Docker",
    ],
  },
];

function technicalLayers(technologies: string[]) {
  return layerRules
    .map((layer) => ({
      ...layer,
      items: technologies.filter((technology) =>
        layer.technologies.includes(technology),
      ),
    }))
    .filter((layer) => layer.items.length > 0);
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const project = localized(locale).find((p) => p.slug === slug);
  if (!project) return {};
  const title = `${project.name}: ${project.detail!.tagline}`;
  return {
    title,
    description: project.description,
    alternates: localeAlternates(locale, `/projects/${slug}/`, `/projects/${slug}.md`),
    openGraph: {
      ...ogLocale(locale),
      title,
      description: project.description,
      url: localePath(locale, `/projects/${slug}/`),
      type: "article",
    },
    twitter: {
      title,
      description: project.description,
      card: "summary_large_image",
    },
  };
}
export default async function ProjectPage({ params }: Props) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const t = ui(locale).projectPage;
  const list = localized(locale);
  const project = list.find((p) => p.slug === slug);
  if (!project) notFound();
  const detail = project.detail!;
  const next = list[(list.indexOf(project) + 1) % list.length];
  const site =
    project.href?.startsWith("http") && project.href !== project.repo
      ? project.href
      : undefined;
  const layers = technicalLayers(detail.technologies);
  return (
    <PageTransition key={slug}>
      <main id="main-content" className="case-detail">
        <div className="container">
          <Link
            href={localePath(locale, "/#projects")}
            className="back-link"
            transitionTypes={[BACK]}
          >
            <ArrowLeft size={16} />
            {t.back}
          </Link>
          <header className="case-detail-header">
            <span className="eyebrow">
              {t.label} / {project.status}
            </span>
            <h1>
              {project.name}
              <span className="accent">.</span>
            </h1>
            <p>{detail.tagline}.</p>
            <div className="project-stack-block">
              <div className="project-stack-heading">
                <span>{t.stackLabel}</span>
                <span>{t.technologiesCount(detail.technologies.length)}</span>
              </div>
              <ul className="project-tech-list" aria-label={ui(locale).casePage.technologies}>
                {detail.technologies.map((tech, index) => (
                  <li className={index < 3 ? "is-core" : undefined} key={tech}>
                    <span className="project-tech-index">{String(index + 1).padStart(2, "0")}</span>
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
            <div className="project-detail-links">
              {site && (
                <a
                  className="button primary"
                  href={site}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.open} <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              )}
              {project.repo && (
                <a
                  className={`button ${site ? "secondary" : "primary"}`}
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={16} aria-hidden="true" /> {t.code}
                </a>
              )}
            </div>
          </header>
          {detail.image && (
            <figure className={`project-shot ${site ? "project-shot-link" : ""}`}>
              {site ? (
                <a
                  href={site}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.name} — ${t.visitSite}`}
                >
                  <Image
                    src={detail.image.src}
                    alt={detail.image.alt}
                    width={detail.image.width}
                    height={detail.image.height}
                    sizes="(max-width: 1120px) 100vw, 1120px"
                    priority
                  />
                  <span className="project-preview-label">
                    {t.visitSite}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </span>
                </a>
              ) : (
                <Image
                  src={detail.image.src}
                  alt={detail.image.alt}
                  width={detail.image.width}
                  height={detail.image.height}
                  sizes="(max-width: 1120px) 100vw, 1120px"
                  priority
                />
              )}
            </figure>
          )}
          {layers.length > 0 && (
            <section className="project-technical-map" aria-labelledby="technical-map-title">
              <div className="technical-map-heading">
                <div>
                  <span className="eyebrow">{t.stackMap}</span>
                  <h2 id="technical-map-title">{t.technicalMapTitle}</h2>
                </div>
                <p>{t.technicalMapBody}</p>
              </div>
              <div className="technical-map-grid">
                {layers.map((layer, index) => (
                  <article className="technical-layer" key={layer.key}>
                    <span className="technical-layer-index">{String(index + 1).padStart(2, "0")}</span>
                    <h3>{t.layers[layer.key]}</h3>
                    <ul>
                      {layer.items.map((technology) => (
                        <li key={technology}>{technology}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          )}
          <div className="case-detail-grid">
            <aside className="case-index">
              <span className="eyebrow">{t.contents}</span>
              <nav aria-label={t.contentsNav} data-scrollspy>
                <a href="#overview">{t.overview}</a>
                <a href="#features">{t.features}</a>
                {detail.motivation && <a href="#why">{t.why}</a>}
                <a href="#engineering">{t.engineering}</a>
                {detail.decision && <a href="#decision">{t.decision}</a>}
                {detail.limits && <a href="#limits">{t.limits}</a>}
              </nav>
            </aside>
            <article className="case-prose">
              <section id="overview">
                <h2>{t.overview}</h2>
                <p>{detail.overview}</p>
              </section>
              <section id="features">
                <h2>{t.features}</h2>
                <ul className="case-feature-list">
                  {detail.features.map((point, index) => (
                    <li key={point}>
                      <span className="case-list-index">{String(index + 1).padStart(2, "0")}</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
              {detail.motivation && (
                <section id="why">
                  <h2>{t.why}</h2>
                  {detail.motivation.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </section>
              )}
              {detail.callout && (
                <section className="outcome-panel" aria-label={t.keyDecision}>
                  <h2>{detail.callout.title}</h2>
                  <p>{detail.callout.body}</p>
                </section>
              )}
              <section id="engineering">
                <h2>{t.engineering}</h2>
                {detail.engineeringIntro && <p>{detail.engineeringIntro}</p>}
                <ul className="case-engineering-list">
                  {detail.engineering.map((point, index) => (
                    <li key={point}>
                      <span className="case-list-index">{String(index + 1).padStart(2, "0")}</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                {detail.engineeringNote && <p>{detail.engineeringNote}</p>}
              </section>
              {detail.decision && (
                <section id="decision">
                  <h2>{t.decision}</h2>
                  {detail.decision.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </section>
              )}
              {detail.limits && (
                <section id="limits">
                  <h2>{t.limits}</h2>
                  <ul>
                    {detail.limits.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </section>
              )}
              {detail.credit && (
                <p className="project-credit">{detail.credit}</p>
              )}
            </article>
          </div>
          <div className="case-next">
            <div>
              <span className="eyebrow">{t.next}</span>
              <Link
                href={localePath(locale, `/projects/${next.slug}/`)}
                transitionTypes={[FORWARD]}
              >
                {next.name}
                <ArrowUpRight size={23} />
              </Link>
            </div>
            <Link
              className="text-link"
              href={localePath(locale, "/#work")}
              transitionTypes={[BACK]}
            >
              {t.production}
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
