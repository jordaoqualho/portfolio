export type EngineeringCase = {
  number: string;
  slug: string;
  category: string;
  title: string;
  summary: string;
  context: string;
  problem?: string;
  investigation?: string[];
  rootCause?: string;
  contribution: string[];
  outcome?: string;
  takeaway: string;
  technologies: string[];
};
export type Experience = {
  company: string;
  title: string;
  dates: string;
  summary: string;
  note?: string;
  technologies: string[];
};
export type Capability = { title: string; description: string };
export const profile = {
  name: "Jordão Qualho",
  role: "Senior Software Engineer",
  focus: "Full Stack with strong Backend depth",
  email: "jordaoqualho@gmail.com",
  linkedin: "https://www.linkedin.com/in/jordao-qualho",
  github: "https://github.com/jordaoqualho",
  location: "Brazil",
  languages: "English C1 Advanced · Portuguese native",
  availability: "Open to remote international roles",
  core: ["Node.js", "TypeScript", "React", "AWS", "GCP"],
  intro:
    "6+ years building and operating production systems across fintech, e-commerce and SaaS, from React applications to backend services supporting millions of users.",
  resumePath: "/resume/Jordao_Qualho_Senior_Software_Engineer_CV.pdf",
};
export const navigation = [
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "Stack", href: "/#stack" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];
export const stats = [
  { value: "6+ years", label: "Professional engineering experience" },
  { value: "7M+ active users", label: "Financial platform experience" },
  { value: "Production systems", label: "Fintech · E-commerce · SaaS · Logistics" },
  { value: "Brazil · Remote", label: "English C1 · LATAM and US teams" },
];
export const capabilities: Capability[] = [
  {
    title: "Backend engineering",
    description:
      "Node.js and TypeScript services, REST APIs and third-party integrations in production, including financial flows on a platform with 7M+ active users.",
  },
  {
    title: "Full Stack development",
    description:
      "React and Next.js product work alongside backend services: shared UI systems, frontend architecture and the APIs those interfaces depend on.",
  },
  {
    title: "Production & reliability",
    description:
      "Incident investigation from logs and traces, production debugging, performance work and the operational details that keep services trustworthy.",
  },
  {
    title: "Cloud & infrastructure",
    description:
      "AWS and GCP production environments, including CloudWatch, Cloud Run, Docker, CI/CD, and the work that follows a cloud migration.",
  },
];
export const cases: EngineeringCase[] = [
  {
    number: "01",
    slug: "financial-onboarding-incident",
    category: "Production debugging · Fintech",
    title: "Finding the real failure behind a misleading financial API error",
    summary:
      "On a financial platform with 7M+ active users, customers were blocked in onboarding by a provider error that did not match the original failure. I traced the request path and isolated the first error.",
    context:
      "I worked on a high-volume financial platform serving more than 7 million active users. Account creation depended on a downstream financial provider.",
    problem:
      "A subset of customers could not complete account creation. The provider first rejected some requests because of an invalid payment due-date rule. Later retries returned “Customer Already Exists”, hiding the original error and sending the team down the wrong path.",
    investigation: [
      "I traced the production request flow in CloudWatch logs and request tracing.",
      "I compared successful and failed requests to see where their behavior diverged.",
      "I worked with the external provider to understand why retries returned a different response from the first request.",
    ],
    rootCause:
      "The frontend allowed unsupported due-date values to reach the downstream integration. The provider accepted due dates only up to day 28. After the first failure, retries produced a different, misleading error.",
    contribution: [
      "Traced the request flow and identified the original failure.",
      "Isolated the external integration behavior.",
      "Helped create a recovery path for affected accounts.",
      "Helped stop invalid due dates from reaching the integration.",
    ],
    outcome:
      "Invalid due dates stopped reaching the provider, and affected accounts had a recovery path.",
    takeaway:
      "Retries can hide the original failure. If the downstream error changes on the second attempt, the first response is still the one that matters.",
    technologies: [
      "Node.js",
      "TypeScript",
      "AWS",
      "CloudWatch",
      "External APIs",
      "Financial integrations",
    ],
  },
  {
    number: "02",
    slug: "ecommerce-scalability",
    category: "Performance · E-commerce",
    title: "Investigating database timeouts under e-commerce traffic",
    summary:
      "After an AWS-to-GCP migration, a high-traffic e-commerce backend started timing out against the database under load. I tested pooling, caching, cold starts and autoscaling before proposing changes.",
    context:
      "I worked in a high-traffic e-commerce environment after its infrastructure migration from AWS to GCP.",
    problem:
      "The system began experiencing database timeouts under higher traffic. It was not obvious which layer was failing: the database, the application, or the new cloud setup.",
    investigation: [
      "Used load testing and concurrency analysis to investigate behavior under traffic.",
      "Examined cold starts and database connection pooling.",
      "Analyzed caching and autoscaling alongside database and infrastructure bottlenecks.",
    ],
    rootCause:
      "The timeouts were not one misconfigured parameter. They came from the interaction of cold starts, connection pooling, caching and autoscaling after the migration.",
    contribution: [
      "Investigated system behavior under load instead of guessing at a fix.",
      "Tested hypotheses before proposing architecture changes.",
      "Analyzed database and infrastructure bottlenecks.",
      "Contributed to improvements involving pooling, caching and autoscaling.",
    ],
    outcome:
      "Pooling, caching and autoscaling changes followed the investigation, and the system handled traffic more reliably afterwards.",
    takeaway:
      "Performance problems are rarely solved by changing one parameter. Measure each layer before deciding where to optimize.",
    technologies: [
      "Node.js",
      "GCP",
      "Cloud Run",
      "Databases",
      "Caching",
      "Load testing",
      "Observability",
    ],
  },
  {
    number: "03",
    slug: "frontend-infrastructure",
    category: "Frontend architecture · Healthcare",
    title: "Standing up a shared React system for a US healthcare team",
    summary:
      "A US healthcare product needed a shared React foundation and a delivery path. In a short advisory engagement, I built the component system, micro-frontend integration and baseline AWS/ArgoCD workflow.",
    context:
      "I worked through Tecla on a short advisory engagement for Sully, a US-based AI-assisted healthcare workflow platform.",
    problem:
      "The team needed a consistent UI system and a deployable frontend architecture before a larger group could build on it.",
    contribution: [
      "Built a reusable React component system using Atomic Design in a monorepo.",
      "Implemented early data views and micro-frontend integration.",
      "Set up baseline AWS infrastructure for FHIR-compliant healthcare workflows and automated CI/CD with ArgoCD.",
      "Aligned implementation directly with US-based healthcare stakeholders.",
    ],
    outcome:
      "The shared frontend system and baseline infrastructure were in place. The client later discontinued the project after funding and team changes.",
    takeaway:
      "Shared frontend infrastructure only creates leverage when teams can adopt it without losing autonomy.",
    technologies: [
      "React",
      "TypeScript",
      "Storybook",
      "AWS",
      "ArgoCD",
      "Micro-frontends",
    ],
  },
];
export const experience: Experience[] = [
  {
    company: "Afinz / client Sem Parar",
    title: "Senior Backend Engineer · Contract / B2B",
    dates: "Dec 2023 – Aug 2026",
    summary:
      "Backend engineer and technical lead for a financial-services squad on Sem Parar, a platform with 7M+ active users. I investigated production incidents, worked through API integrations with product stakeholders, and improved testing, documentation and onboarding.",
    technologies: [
      "Node.js",
      "TypeScript",
      "AWS",
      "DynamoDB",
      "MySQL",
      "CloudWatch",
    ],
  },
  {
    company: "Sully",
    title: "Senior Full Stack Engineer · Advisory / B2B",
    dates: "Mar 2026 – Apr 2026",
    summary:
      "Short advisory for a US healthcare workflow product. I set up a shared React component system, micro-frontend integration, and baseline AWS/ArgoCD delivery.",
    note: "Advisory engagement through Tecla. The client discontinued the project following funding and team restructuring.",
    technologies: ["React", "TypeScript", "AWS", "FHIR", "ArgoCD"],
  },
  {
    company: "ROIT GROUP",
    title: "Senior Full Stack Engineer",
    dates: "Jul 2023 – Nov 2023",
    summary:
      "Worked on NestJS microservices for analytical product routes. I designed Redis caching and invalidation, and raised automated test coverage above 85% on the core services.",
    technologies: ["React", "NestJS", "Redis", "TypeScript", "Jest"],
  },
  {
    company: "Voyager Portal",
    title: "Senior Full Stack Engineer",
    dates: "Nov 2022 – Jun 2023",
    summary:
      "Maritime logistics platform. I rebuilt a reporting microservice from Python to TypeScript to cut memory use and stop runtime failures, and built stateful Vue.js interfaces for operations teams.",
    technologies: ["TypeScript", "Vue.js", "Node.js", "Python"],
  },
  {
    company: "Grupo Soma",
    title: "Full Stack Engineer & Tech Lead",
    dates: "Nov 2021 – Nov 2022",
    summary:
      "Live commerce on GCP. Promoted to Technical Lead within six months; I owned Cloud Run services that handled 12,000+ concurrent users, mentored engineers, and established code review standards.",
    technologies: ["Node.js", "TypeScript", "GCP", "React"],
  },
  {
    company: "Cria Studio",
    title: "Full Stack Engineer",
    dates: "Aug 2021 – Nov 2021",
    summary:
      "Sole engineer on an interactive 2D React product, from technical and product decisions through production release.",
    technologies: ["React"],
  },
  {
    company: "Lorena Felicio",
    title: "Full Stack Engineer",
    dates: "Jan 2020 – Aug 2021",
    summary:
      "Built an ERP from scratch in React, Node.js, MongoDB and AWS S3, including Brazilian tax and invoicing integrations and automated document workflows.",
    technologies: ["React", "Node.js", "MongoDB", "AWS"],
  },
];
export const skills = [
  {
    group: "Backend",
    items: [
      "Node.js",
      "TypeScript",
      "NestJS",
      "Express",
      "AdonisJS",
      "REST APIs",
      "Microservices",
    ],
  },
  {
    group: "Frontend",
    items: [
      "React",
      "Next.js",
      "Vue.js",
      "Tailwind CSS",
      "Redux",
      "Storybook",
      "Micro-frontends",
    ],
  },
  {
    group: "Data",
    items: ["PostgreSQL", "MySQL", "DynamoDB", "MongoDB", "Redis", "Firestore"],
  },
  {
    group: "Cloud & infrastructure",
    items: [
      "AWS",
      "Google Cloud Platform",
      "Docker",
      "GitHub Actions",
      "ArgoCD",
      "CloudWatch",
      "CI/CD",
    ],
  },
  {
    group: "Engineering",
    items: [
      "Production debugging",
      "Incident investigation",
      "Observability",
      "Performance",
      "API integrations",
      "Automated testing",
      "Technical leadership",
    ],
  },
];
export const principles = [
  "I debug from evidence, not assumptions.",
  "I prefer simple systems before complex abstractions.",
  "Observability should exist before production fails.",
  "AI can accelerate engineering, but it does not replace understanding the code.",
  "I would rather name a trade-off than hide it behind a best practice.",
];
export const about = [
  "I’m a Senior Software Engineer based in Brazil, with 6+ years of production experience across fintech, e-commerce, SaaS and logistics. I work in English (C1) with remote teams in LATAM and the US.",
  "My work is Full Stack, with more time spent on backend systems, APIs, cloud infrastructure and production reliability.",
  "I do best on teams that expect engineers to investigate real production behavior and take part in technical decisions, not just close tickets.",
];
export const contact = {
  title: "Looking for a Senior Software Engineer?",
  description:
    "I’m open to Senior Software Engineer, Full Stack and Backend roles with remote teams in Brazil, LATAM and internationally.",
};
