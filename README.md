# Jordão Qualho — Senior Software Engineer

Production engineering portfolio for recruiters and engineering managers. It leads with role, backend depth, and verified case studies — not a project gallery.

**Live:** [jordaoqualho.com](https://jordaoqualho.com)

Node.js · TypeScript · React · AWS · GCP

## What this site is for

Hiring conversations. The first screen answers who I am, what I specialize in, and how to reach me. Selected work is written as production problems: context, investigation, contribution, and outcome. Experience stays chronological and scoped to what I can stand behind.

## Pages

- `/` — profile, capabilities, cases, experience, stack, contact
- `/work/financial-onboarding-incident/` — fintech production debugging
- `/work/live-commerce-traffic-spike/` — a 12k-user live commerce spike, load testing and Cloud Run autoscaling
- `/work/healthcare-react-component-system/` — a shared React component system across healthcare micro-frontends
- `/agents/` — how to read this profile with an AI assistant
- `/developers/` — REST API docs (`/docs` redirects here)
- `/privacy/` — analytics and data notice

## For AI agents

The same content is available to machines, generated from `src/data/` so it never drifts from the pages:

- `/llms.txt` — summary, when to use this profile, how to call it, and reading order
- `/llms-full.txt` — the whole profile in one Markdown file
- Markdown pages — send `Accept: text/markdown` to any page, or append `.md` (`/index.md`, `/work/<slug>.md`). Handled by `src/proxy.ts`, served from `src/app/md/`
- `/api/mcp` — remote MCP server (Streamable HTTP, stateless). Tools live in `src/mcp/server.ts`
- `/api/*` — read-only REST API with the same queries (`src/lib/profile-api.ts`). Errors are RFC 9457 `application/problem+json`, including unknown paths and wrong methods
- `/openapi.json` — OpenAPI 3.1 contract, generated in `src/lib/openapi.ts`; `/.well-known/api-catalog` is the RFC 9727 catalog

```sh
claude mcp add --transport http jordao-qualho https://jordaoqualho.com/api/mcp
```

## Run locally

Node.js 20.9+ and npm.

```sh
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No database, CMS, or API keys.

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

Pages are prerendered at build time. The proxy, `/md/*` and `/api/*` run as functions, so preview with `npm run start`.

## Stack

Next.js 16 App Router, TypeScript, Tailwind CSS, Geist, Lucide, MCP TypeScript SDK. Content lives in `src/data/profile.ts`; agent docs in `src/data/agents.ts`. Only the header, copy buttons and motion preference controls need client state.

## Resume

The CV is at `public/resume/Jordao_Qualho_Senior_Software_Engineer_CV.pdf`. Header and contact **Resume** links download that file.

## Deploy

The production host is Vercel. Set `SITE_URL=https://jordaoqualho.com` so canonical URLs, sitemap, Open Graph tags, llms.txt and MCP setup snippets stay correct.

## Contact

- [jordaoqualho@gmail.com](mailto:jordaoqualho@gmail.com)
- [LinkedIn](https://www.linkedin.com/in/jordao-qualho)
- [GitHub](https://github.com/jordaoqualho)
