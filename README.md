# Jordão Qualho — Senior Software Engineer

Production engineering portfolio for recruiters and engineering managers. It leads with role, backend depth, and verified case studies — not a project gallery.

**Live:** [jordao-qualho.vercel.app](https://jordao-qualho.vercel.app)

Node.js · TypeScript · React · AWS · GCP

## What this site is for

Hiring conversations. The first screen answers who I am, what I specialize in, and how to reach me. Selected work is written as production problems: context, investigation, contribution, and outcome. Experience stays chronological and scoped to what I can stand behind.

## Pages

- `/` — profile, capabilities, cases, experience, stack, contact
- `/work/financial-onboarding-incident/` — fintech production debugging
- `/work/ecommerce-scalability/` — e-commerce performance after an AWS → GCP migration
- `/work/frontend-infrastructure/` — shared React infrastructure for a US healthcare platform

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
npm run build
```

`next build` writes a static export to `out/`. Preview that folder with any static server.

## Stack

Next.js 16 App Router (static export), TypeScript, Tailwind CSS, Geist, Lucide. Content lives in `src/data/profile.ts`. Only the header and motion preference controls need client state.

## Resume

The CV is at `public/resume/Jordao_Qualho_Senior_Software_Engineer_CV.pdf`. Header and contact **Resume** links download that file.

## Deploy

The production host is Vercel. Set `SITE_URL` to the public origin so canonical URLs, sitemap, and Open Graph tags stay correct.

## Contact

- [jordaoqualho@gmail.com](mailto:jordaoqualho@gmail.com)
- [LinkedIn](https://www.linkedin.com/in/jordao-qualho)
- [GitHub](https://github.com/jordaoqualho)
