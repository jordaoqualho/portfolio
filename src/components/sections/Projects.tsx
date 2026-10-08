import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";
import { getContent } from "@/data/content";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import { ui } from "@/i18n/ui";
import { FORWARD } from "@/lib/motion";
export function Projects({ locale }: { locale: Locale }) {
  const { currentlyBuilding, projects } = getContent(locale);
  const t = ui(locale).projects;
  return (
    <section id="projects" className="container section projects-section">
      <div className="section-heading">
        <div>
          <h2>
            {t.title}
            <span className="accent">.</span>
          </h2>
          <p>{currentlyBuilding}</p>
        </div>
      </div>
      <div className="project-grid">
        {projects.map((project) => {
          const page = localePath(
            locale,
            project.slug ? `/projects/${project.slug}/` : (project.href ?? ""),
          );
          const site =
            project.href?.startsWith("http") && project.href !== project.repo
              ? project.href
              : undefined;
          const preview = project.detail?.image;
          const previewHref = site ?? page;
          return (
            <article className="project-card" key={project.name}>
              {preview && previewHref && (
                <a
                  className="project-preview"
                  href={previewHref}
                  target={site ? "_blank" : undefined}
                  rel={site ? "noopener noreferrer" : undefined}
                  aria-label={`${project.name} — ${site ? t.liveSite : t.viewProject}`}
                >
                  <Image
                    src={preview.src}
                    alt={preview.alt}
                    width={preview.width}
                    height={preview.height}
                    sizes="(max-width: 767px) 100vw, 50vw"
                  />
                  <span className="project-preview-label">
                    {site ? t.liveSite : t.viewProject}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </span>
                </a>
              )}
              <div className="project-meta">
                <span className="project-status">{project.status}</span>
              </div>
              <h3>
                {page ? (
                  // Stretched over the card; the site and code links sit above it.
                  <Link
                    className="project-link"
                    href={page}
                    transitionTypes={[FORWARD]}
                  >
                    {project.name}
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                ) : (
                  project.name
                )}
              </h3>
              <p>{project.description}</p>
              {project.byline && (
                <p className="project-byline">{project.byline}</p>
              )}
              {project.stack && (
                <ul className="tech-list" aria-label={t.technologies}>
                  {project.stack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              )}
              {(site || project.repo) && (
                <div className="project-links">
                  {site && (
                    <a href={site} target="_blank" rel="noopener noreferrer">
                      {t.liveSite} <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  )}
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github size={14} aria-hidden="true" /> {t.code}
                    </a>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
