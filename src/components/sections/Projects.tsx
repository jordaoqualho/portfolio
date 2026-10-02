import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { currentlyBuilding, projects } from "@/data/profile";
import { FORWARD } from "@/lib/motion";
export function Projects() {
  return (
    <section id="projects" className="container section projects-section">
      <div className="section-heading">
        <div>
          <h2>
            What I’m building outside work<span className="accent">.</span>
          </h2>
          <p>{currentlyBuilding}</p>
        </div>
      </div>
      <div className="project-grid">
        {projects.map((project) => {
          const page = project.slug ? `/projects/${project.slug}/` : project.href;
          const site =
            project.href?.startsWith("http") && project.href !== project.repo
              ? project.href
              : undefined;
          return (
            <article className="project-card" key={project.name}>
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
                <ul className="tech-list" aria-label="Technologies">
                  {project.stack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              )}
              {(site || project.repo) && (
                <div className="project-links">
                  {site && (
                    <a href={site} target="_blank" rel="noopener noreferrer">
                      Live site <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  )}
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github size={14} aria-hidden="true" /> Code
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
