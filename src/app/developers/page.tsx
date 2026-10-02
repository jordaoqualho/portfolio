import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import {
  developerBasics,
  developerIntro,
  errorExample,
  errorHints,
  functionCalling,
  machineFiles,
  quickstart,
} from "@/data/developers";
import { errorCodes, type ErrorCode } from "@/lib/api";
import { apiIndex } from "@/lib/openapi";
import { CopyCommand } from "@/components/agents/CopyCommand";
import { PageTransition } from "@/components/motion/PageTransition";
import { BACK, FORWARD } from "@/lib/motion";
const title = "Developers: Jordão Qualho Profile API";
const description =
  "Public, keyless JSON API and OpenAPI 3.1 spec for Jordão Qualho's engineering profile: cases, experience and job-fit matching. Also available over MCP.";
export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: "/developers/",
    types: { "text/markdown": "/developers.md" },
  },
  openGraph: { title, description, url: "/developers/" },
  twitter: { title, description, card: "summary_large_image" },
};
export default function DevelopersPage() {
  const { endpoints } = apiIndex();
  return (
    <PageTransition>
      <main id="main-content" className="case-detail">
        <div className="container">
          <Link href="/" className="back-link" transitionTypes={[BACK]}>
            <ArrowLeft size={16} />
            Back to profile
          </Link>
          <header className="case-detail-header">
            <span className="eyebrow">DEVELOPERS / JORDÃO QUALHO PROFILE API</span>
            <h1>
              Profile API<span className="accent">.</span>
            </h1>
            <p>{developerIntro}</p>
            <ul className="tech-list" aria-label="API facts">
              <li>OpenAPI 3.1</li>
              <li>No API key</li>
              <li>Read-only</li>
              <li>RFC 9457 errors</li>
            </ul>
          </header>
          <div className="case-detail-grid">
            <aside className="case-index">
              <span className="eyebrow">ON THIS PAGE</span>
              <nav aria-label="Page contents" data-scrollspy>
                <a href="#overview">Overview</a>
                <a href="#quickstart">Quickstart</a>
                <a href="#endpoints">Endpoints</a>
                <a href="#errors">Errors</a>
                <a href="#function-calling">Function calling and MCP</a>
                <a href="#files">Machine-readable files</a>
              </nav>
            </aside>
            <article className="case-prose">
              <section id="overview">
                <h2>Overview</h2>
                <dl className="agent-tools">
                  {developerBasics.map((item) => (
                    <div key={item.term}>
                      <dt>{item.term}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
              <section id="quickstart">
                <h2>Quickstart</h2>
                <p>Three calls cover most questions about my experience.</p>
                <CopyCommand code={quickstart} label="quickstart commands" />
              </section>
              <section id="endpoints">
                <h2>Endpoints</h2>
                <dl className="agent-tools">
                  {endpoints.map((endpoint) => (
                    <div key={endpoint.operationId}>
                      <dt>
                        <code>
                          {endpoint.method} {endpoint.path}
                        </code>
                      </dt>
                      <dd>
                        {endpoint.summary} · <code>{endpoint.operationId}</code>
                      </dd>
                    </div>
                  ))}
                </dl>
                <p>
                  Full request and response schemas are in{" "}
                  <a className="text-link" href="/openapi.json">
                    openapi.json
                  </a>
                  .
                </p>
              </section>
              <section id="errors">
                <h2>Errors</h2>
                <p>
                  Every error, including unknown paths under <code>/api</code>,
                  returns JSON problem details, never an HTML page.
                </p>
                <dl className="agent-tools">
                  {(Object.keys(errorCodes) as ErrorCode[]).map((code) => (
                    <div key={code} id={`error-${code}`}>
                      <dt>
                        <code>
                          {errorCodes[code].status} {code}
                        </code>
                      </dt>
                      <dd>{errorHints[code]}</dd>
                    </div>
                  ))}
                </dl>
                <CopyCommand code={errorExample} label="error example" />
              </section>
              <section id="function-calling">
                <h2>Function calling and MCP</h2>
                <p>{functionCalling}</p>
                <p>
                  <Link
                    className="text-link"
                    href="/agents/"
                    transitionTypes={[FORWARD]}
                  >
                    Connect the MCP server
                    <ArrowUpRight size={16} />
                  </Link>
                </p>
              </section>
              <section id="files">
                <h2>Machine-readable files</h2>
                <dl className="agent-tools">
                  {machineFiles.map((file) => (
                    <div key={file.path}>
                      <dt>
                        <a href={file.path}>
                          <code>{file.path}</code>
                        </a>
                      </dt>
                      <dd>{file.description}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </article>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
