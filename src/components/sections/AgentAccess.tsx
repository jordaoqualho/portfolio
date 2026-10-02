import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { mcpClients, mcpTools } from "@/data/agents";
import { CopyCommand } from "@/components/agents/CopyCommand";
import { FORWARD } from "@/lib/motion";
export function AgentAccess() {
  const claudeCode = mcpClients[0];
  return (
    <section id="agents" className="agents-section section">
      <div className="container editorial-grid">
        <div className="section-heading">
          <div>
            <span className="eyebrow">FOR AI AGENTS</span>
            <h2>
              Let your AI assistant check my fit<span className="accent">.</span>
            </h2>
            <p>
              My profile runs its own MCP server, the open standard that lets
              Claude, ChatGPT and Cursor connect to live data. Your assistant
              reads my verified cases and experience directly, so its answers
              come from facts, not guesses from a CV.
            </p>
          </div>
        </div>
        <div className="agents-body">
          <div className="agent-audience">
            <h3>For recruiters: a straight answer, backed by real work</h3>
            <p>
              Give your AI assistant my portfolio URL, or connect directly to
              the MCP server for structured access to my experience and
              engineering cases. Hand it your job description: it maps the
              requirements against my experience and points to the cases that
              support each match.
            </p>
            <blockquote className="agent-example">
              “Here’s our job description. Which requirements does Jordão match?”
            </blockquote>
          </div>
          <div className="agent-audience">
            <h3>For engineers: a working MCP server, not a demo</h3>
            <p>
              Streamable HTTP, stateless, no API key. {mcpTools.length}{" "}
              read-only tools over the same data that renders this site, plus
              llms.txt and Markdown on every page.
            </p>
            <ul className="tech-list" aria-label="MCP tools">
              {mcpTools.map((tool) => (
                <li key={tool.name}>{tool.name}</li>
              ))}
            </ul>
            <CopyCommand code={claudeCode.code} label="Claude Code command" />
            <p className="agent-links">
              Prefer REST?{" "}
              <Link href="/developers/" transitionTypes={[FORWARD]}>
                API docs
              </Link>{" "}
              · <a href="/openapi.json">OpenAPI spec</a>
            </p>
          </div>
          <Link
            href="/agents/"
            className="button primary agent-cta"
            transitionTypes={[FORWARD]}
          >
            See how to connect
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
