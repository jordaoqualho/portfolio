import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { projects } from "@/data/profile";
import { PageTransition } from "@/components/motion/PageTransition";
import { BACK, FORWARD } from "@/lib/motion";
export const dynamicParams = false;
const detailed = projects.filter((p) => p.slug && p.detail);
export function generateStaticParams() {
  return detailed.map((project) => ({ slug: project.slug! }));
}
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = detailed.find((p) => p.slug === slug);
  if (!project) return {};
  const title = `${project.name}: ${project.detail!.tagline}`;
  return {
    title,
    description: project.description,
    alternates: {
      canonical: `/projects/${slug}/`,
      types: { "text/markdown": `/projects/${slug}.md` },
    },
    openGraph: {
      title,
      description: project.description,
      url: `/projects/${slug}/`,
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
  const { slug } = await params;
  const project = detailed.find((p) => p.slug === slug);
  if (!project) notFound();
  const detail = project.detail!;
  const next = detailed[(detailed.indexOf(project) + 1) % detailed.length];
  const site =
    project.href?.startsWith("http") && project.href !== project.repo
      ? project.href
      : undefined;
  return (
    <PageTransition key={slug}>
      <main id="main-content" className="case-detail">
        <div className="container">
          <Link
            href="/#projects"
            className="back-link"
            transitionTypes={[BACK]}
          >
            <ArrowLeft size={16} />
            All projects
          </Link>
          <header className="case-detail-header">
            <span className="eyebrow">
              SIDE PROJECT / {project.status}
            </span>
            <h1>
              {project.name}
              <span className="accent">.</span>
            </h1>
            <p>{detail.tagline}.</p>
            <ul className="tech-list" aria-label="Technologies">
              {detail.technologies.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
            <div className="project-detail-links">
              {site && (
                <a
                  className="button primary"
                  href={site}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open the app <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              )}
              {project.repo && (
                <a
                  className={`button ${site ? "secondary" : "primary"}`}
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={16} aria-hidden="true" /> View the code
                </a>
              )}
            </div>
          </header>
          {detail.image && (
            <figure className="project-shot">
              <Image
                src={detail.image.src}
                alt={detail.image.alt}
                width={detail.image.width}
                height={detail.image.height}
                sizes="(max-width: 1120px) 100vw, 1120px"
                priority
              />
            </figure>
          )}
          <div className="case-detail-grid">
            <aside className="case-index">
              <span className="eyebrow">IN THIS PROJECT</span>
              <nav aria-label="Project contents" data-scrollspy>
                <a href="#overview">Overview</a>
                <a href="#features">What it does</a>
                {detail.motivation && <a href="#why">Why I built it</a>}
                <a href="#engineering">How it’s built</a>
                {detail.decision && <a href="#decision">Design decision</a>}
                {detail.limits && <a href="#limits">Deliberate limits</a>}
              </nav>
            </aside>
            <article className="case-prose">
              <section id="overview">
                <h2>Overview</h2>
                <p>{detail.overview}</p>
              </section>
              <section id="features">
                <h2>What it does</h2>
                <ul>
                  {detail.features.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </section>
              {detail.motivation && (
                <section id="why">
                  <h2>Why I built it</h2>
                  {detail.motivation.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </section>
              )}
              {detail.callout && (
                <section className="outcome-panel" aria-label="Key decision">
                  <h2>{detail.callout.title}</h2>
                  <p>{detail.callout.body}</p>
                </section>
              )}
              <section id="engineering">
                <h2>How it’s built</h2>
                {detail.engineeringIntro && <p>{detail.engineeringIntro}</p>}
                <ul>
                  {detail.engineering.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                {detail.engineeringNote && <p>{detail.engineeringNote}</p>}
              </section>
              {detail.decision && (
                <section id="decision">
                  <h2>Design decision</h2>
                  {detail.decision.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </section>
              )}
              {detail.limits && (
                <section id="limits">
                  <h2>Deliberate limits</h2>
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
              <span className="eyebrow">NEXT PROJECT</span>
              <Link
                href={`/projects/${next.slug}/`}
                transitionTypes={[FORWARD]}
              >
                {next.name}
                <ArrowUpRight size={23} />
              </Link>
            </div>
            <Link className="text-link" href="/#work" transitionTypes={[BACK]}>
              See production work
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
