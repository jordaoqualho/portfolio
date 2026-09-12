import Image from "next/image";
import { ArrowDown, ArrowUpRight, Github, MapPin } from "lucide-react";
import { profile, stats } from "@/data/profile";
export function Hero() {
  return (
    <>
      <div className="hero-stage">
        <div className="hero-orb" aria-hidden="true" />
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero-topline">
            <span className="eyebrow">JORDÃO QUALHO / ENGINEERING PROFILE</span>
            <span className="availability">
              <span />
              Open to remote opportunities
            </span>
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <h1 id="hero-title">
                Senior Software
                <br />
                Engineer<span className="accent">.</span>
              </h1>
              <p className="hero-focus">
                Full Stack with strong <strong>Backend depth.</strong>
              </p>
              <p className="hero-description">{profile.intro}</p>
              <p className="core-stack">{profile.core.join(" · ")}</p>
              <div className="hero-ctas">
                <a className="button primary" href="#work">
                  View engineering cases <ArrowDown size={17} />
                </a>
                <a
                  className="button secondary"
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn <ArrowUpRight size={16} />
                </a>
                <a
                  className="github-link"
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub (opens in a new tab)"
                >
                  <Github size={20} />
                </a>
              </div>
            </div>
            <aside className="profile-aside">
              <Image
                className="portrait"
                src="/portrait.webp"
                alt="Jordão Qualho"
                width={224}
                height={250}
                priority
              />
              <div className="portrait-caption">
                <span>{profile.name}</span>
                <span>
                  <MapPin size={13} />
                  {profile.location}
                </span>
              </div>
            </aside>
          </div>
        </section>
      </div>
      <section
        className="container snapshot"
        aria-label="Professional snapshot"
      >
        {stats.map((stat) => (
          <div key={stat.value}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>
    </>
  );
}
