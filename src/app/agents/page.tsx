import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import {
  agentChannels,
  agentGroundRules,
  agentIntro,
  examplePrompts,
  markdownExamples,
  mcpClients,
  mcpTools,
  readingOrder,
} from "@/data/agents";
import { profile } from "@/data/profile";
import { CopyCommand } from "@/components/agents/CopyCommand";
import { PageTransition } from "@/components/motion/PageTransition";
import { BACK } from "@/lib/motion";
const title = "For AI agents";
const description =
  "Read Jordão Qualho's engineering profile with an AI assistant: llms.txt, Markdown pages and a remote MCP server with tools for cases, experience and job fit.";
export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/agents/",
    types: { "text/markdown": "/agents.md" },
  },
  openGraph: { title, description, url: "/agents/" },
  twitter: { title, description, card: "summary_large_image" },
};
export default function AgentsPage() {
  return (
    <PageTransition>
      <main id="main-content" className="case-detail">
        <div className="container">
          <Link href="/#agents" className="back-link" transitionTypes={[BACK]}>
            <ArrowLeft size={16} />
            Back to profile
          </Link>
          <header className="case-detail-header">
            <span className="eyebrow">FOR AI AGENTS / MACHINE-READABLE PROFILE</span>
            <h1>
              Screen this profile with your AI assistant
              <span className="accent">.</span>
            </h1>
            <p>{agentIntro[0]}</p>
            <ul className="tech-list" aria-label="Interfaces">
              {agentChannels.map((channel) => (
                <li key={channel.label}>{channel.label}</li>
              ))}
            </ul>
          </header>
          <div className="case-detail-grid">
            <aside className="case-index">
              <span className="eyebrow">ON THIS PAGE</span>
              <nav aria-label="Page contents" data-scrollspy>
                <a href="#why">Why this exists</a>
                <a href="#reading-order">Reading order</a>
                <a href="#markdown">Markdown pages</a>
                <a href="#mcp">Connect the MCP server</a>
                <a href="#tools">Tools</a>
                <a href="#prompts">Try asking</a>
              </nav>
            </aside>
            <article className="case-prose">
              <section id="why">
                <h2>Why this exists</h2>
                {agentIntro.slice(1).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
              <section id="reading-order">
                <h2>Reading order</h2>
                <ol>
                  {readingOrder.map((step) => (
                    <li key={step.path}>
                      <code>{step.path}</code> {step.text}
                    </li>
                  ))}
                </ol>
              </section>
              <section id="markdown">
                <h2>Markdown pages</h2>
                <p>
                  Send <code>Accept: text/markdown</code> to any page URL, or
                  append <code>.md</code> to its path. The answer is the same
                  content as the HTML page, without layout or scripts.
                </p>
                <CopyCommand code={markdownExamples} label="Markdown examples" />
              </section>
              <section id="mcp">
                <h2>Connect the MCP server</h2>
                <p>
                  A remote MCP server over Streamable HTTP. No key, no account.
                </p>
                {mcpClients.map((client) => (
                  <div className="agent-client" key={client.name}>
                    <h3>{client.name}</h3>
                    <p>{client.note}</p>
                    <CopyCommand
                      code={client.code}
                      label={`${client.name} setup`}
                    />
                  </div>
                ))}
              </section>
              <section id="tools">
                <h2>Tools</h2>
                <dl className="agent-tools">
                  {mcpTools.map((tool) => (
                    <div key={tool.name}>
                      <dt>
                        <code>
                          {tool.name}({tool.params})
                        </code>
                      </dt>
                      <dd>{tool.description}</dd>
                    </div>
                  ))}
                </dl>
              </section>
              <section id="prompts">
                <h2>Try asking</h2>
                <ul>
                  {examplePrompts.map((prompt) => (
                    <li key={prompt}>{prompt}</li>
                  ))}
                </ul>
              </section>
              <section className="outcome-panel">
                <span className="eyebrow">GROUND RULES</span>
                <h2>Read-only and verifiable</h2>
                <p>{agentGroundRules}</p>
              </section>
            </article>
          </div>
          <div className="case-next">
            <div>
              <span className="eyebrow">PREFER TO TALK TO A PERSON?</span>
              <a href={`mailto:${profile.email}`}>
                {profile.email}
                <ArrowUpRight size={23} />
              </a>
            </div>
            <a className="text-link" href="/llms.txt">
              Open llms.txt
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
