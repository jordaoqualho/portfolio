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
  availability: "Open to remote opportunities",
  core: ["Node.js", "TypeScript", "React", "AWS", "GCP"],
  intro:
    "6+ years building and operating production systems, with deeper experience in backend engineering, APIs, cloud infrastructure, reliability and production debugging.",
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
  { value: "Production systems", label: "Fintech · E-commerce · SaaS · AI" },
  { value: "Remote experience", label: "Brazil · LATAM · US teams" },
];
export const capabilities: Capability[] = [
  {
    title: "Backend engineering",
    description:
      "Node.js, TypeScript, REST APIs, integrations, microservices and production backend systems.",
  },
  {
    title: "Full Stack development",
    description:
      "React, Next.js and frontend architecture, in close collaboration with product and backend teams.",
  },
  {
    title: "Production & reliability",
    description:
      "Production debugging, incident investigation, observability, performance and reliability improvements.",
  },
  {
    title: "Cloud & infrastructure",
    description:
      "AWS, GCP, Docker, CI/CD, deployment workflows and cloud-based production environments.",
  },
];
export const cases: EngineeringCase[] = [
  {
    number: "01",
    slug: "financial-onboarding-incident",
    category: "Production debugging / Fintech",
    title: "Diagnosing a Financial Onboarding Failure",
    summary:
      "Tracing a misleading provider error back to the original failure in a financial onboarding flow.",
    context:
      "I worked on a high-volume financial platform serving more than 7 million active users.",
    problem:
      "A subset of customers could not complete account creation. The downstream financial provider initially rejected certain requests because of an invalid payment due-date rule. Subsequent attempts returned “Customer Already Exists”, hiding the original error and causing repeated retries.",
    investigation: [
      "I traced the production request flow using CloudWatch logs and request tracing.",
      "I compared successful and failed requests to identify where their behavior diverged.",
      "I worked with the external provider to understand why retries returned a different response from the initial request.",
    ],
    rootCause:
      "The frontend allowed unsupported due-date values to reach the downstream integration. The provider accepted due dates only up to day 28. After the first failure, retries produced a different, misleading error.",
    contribution: [
      "Traced the request flow and identified the original failure.",
      "Isolated the external integration behavior.",
      "Helped create a recovery path for affected accounts.",
      "Helped ensure invalid due dates were prevented from reaching the integration.",
    ],
    outcome:
      "The production flow was corrected and invalid values stopped reaching the provider.",
    takeaway:
      "Retries can make incidents harder to diagnose when downstream errors do not accurately represent the original failure.",
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
    category: "Performance / E-commerce",
    title: "Improving a High-Traffic E-commerce Backend",
    summary:
      "Investigating database timeouts under load after an AWS-to-GCP infrastructure migration.",
    context:
      "I worked in a high-traffic e-commerce environment after its infrastructure migration from AWS to GCP.",
    problem:
      "The system began experiencing database timeouts under higher traffic.",
    investigation: [
      "Used load testing and concurrency analysis to investigate behavior under traffic.",
      "Examined cold starts and database connection pooling.",
      "Analyzed caching and autoscaling behavior alongside database and infrastructure bottlenecks.",
    ],
    contribution: [
      "Investigated system behavior under load.",
      "Tested hypotheses before proposing architecture changes.",
      "Analyzed database and infrastructure bottlenecks.",
      "Contributed to improvements involving pooling, caching and autoscaling.",
    ],
    outcome: "System reliability and the ability to handle traffic improved.",
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
    category: "Frontend architecture / AI healthcare",
    title: "Building Shared Frontend Infrastructure",
    summary:
      "Building a shared React component system, micro-frontend integration and delivery workflows for a US healthcare platform.",
    context:
      "I worked through Tecla on a short advisory engagement for Sully, a US-based AI-assisted healthcare workflow platform. The client later discontinued the project following funding and team restructuring.",
    contribution: [
      "Built a reusable React component system using Atomic Design in a monorepo.",
      "Implemented early data views and micro-frontend integration.",
      "Set up baseline AWS infrastructure for FHIR-compliant healthcare workflows and automated CI/CD with ArgoCD.",
      "Aligned implementation directly with US-based healthcare stakeholders.",
    ],
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
      "Served as squad technical lead for financial services in the Sem Parar ecosystem, on a platform serving 7M+ active users. Investigated production incidents, aligned requirements with product stakeholders, and improved documentation, testing and developer onboarding.",
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
      "Built a reusable React component system with Atomic Design in a monorepo, integrated micro-frontends, and set up baseline AWS infrastructure and ArgoCD delivery workflows for a US healthcare platform.",
    note: "Advisory engagement through Tecla. The client discontinued the project following funding and team restructuring.",
    technologies: ["React", "TypeScript", "AWS", "FHIR", "ArgoCD"],
  },
  {
    company: "ROIT GROUP",
    title: "Senior Full Stack Engineer",
    dates: "Jul 2023 – Nov 2023",
    summary:
      "Designed Redis caching and invalidation strategies for NestJS microservices, reducing latency on analytical routes. Achieved 85%+ automated test coverage across core microservices using Jest.",
    technologies: ["React", "NestJS", "Redis", "TypeScript", "Jest"],
  },
  {
    company: "Voyager Portal",
    title: "Senior Full Stack Engineer",
    dates: "Nov 2022 – Jun 2023",
    summary:
      "Rebuilt a reporting microservice from Python in TypeScript, lowering memory consumption and eliminating runtime failures. Developed complex, stateful Vue.js interfaces for global maritime logistics operations.",
    technologies: ["TypeScript", "Vue.js", "Node.js", "Python"],
  },
  {
    company: "Grupo Soma",
    title: "Full Stack Engineer & Tech Lead",
    dates: "Nov 2021 – Nov 2022",
    summary:
      "Promoted to Technical Lead within six months, owning architecture decisions and GCP infrastructure. Scaled Node.js and Cloud Run services for live commerce with 12,000+ concurrent active users; mentored engineers and established code review standards.",
    technologies: ["Node.js", "TypeScript", "GCP", "React"],
  },
  {
    company: "Cria Studio",
    title: "Full Stack Engineer",
    dates: "Aug 2021 – Nov 2021",
    summary:
      "Delivered an interactive 2D React application as the sole engineer, from technical and product decisions through production. Built responsive interfaces for real-time architectural updates and image overlays.",
    technologies: ["React"],
  },
  {
    company: "Lorena Felicio",
    title: "Full Stack Engineer",
    dates: "Jan 2020 – Aug 2021",
    summary:
      "Built an ERP from scratch with React, Node.js, MongoDB and AWS S3. Integrated Brazilian tax and invoicing APIs, including XML validation and authentication, and automated document workflows.",
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
      "System design",
      "Distributed systems",
      "High-concurrency systems",
      "Production debugging",
      "Observability",
      "Performance",
      "API integrations",
      "Automated testing",
    ],
  },
];
export const principles = [
  "I debug from evidence, not assumptions.",
  "I prefer simple systems before complex abstractions.",
  "I care about observability before production fails.",
  "I use AI as an engineering tool, not as a substitute for understanding the code.",
  "I value maintainability, reliability and explicit trade-offs.",
];
export const about = [
  "I’m a Senior Software Engineer from Brazil with more than six years of professional experience across fintech, e-commerce, SaaS, logistics and AI-related products.",
  "My background is Full Stack, with deeper experience in backend engineering, APIs, cloud infrastructure, production reliability and distributed systems.",
  "I enjoy environments where engineers are expected to understand the problem, investigate production behavior and contribute to technical decisions.",
];
export const contact = {
  title: "Looking for a Senior Software Engineer?",
  description:
    "I’m currently open to Senior Software Engineer, Full Stack and Backend opportunities with remote teams in Brazil, LATAM and international companies.",
};
