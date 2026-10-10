// A case page is an ordered list of sections, so each story can use the
// headings that fit it. Well-known ids (context, contribution, result,
// takeaway, ...) also fill the flat fields the REST API and MCP expose.
export type CaseSection = {
  id: string;
  heading: string;
  body?: string;
  points?: string[];
  ordered?: boolean;
};
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
  sections: CaseSection[];
};
const sectionText = (s?: CaseSection) =>
  s ? [s.body, ...(s.points ?? [])].filter(Boolean).join(" ") : undefined;
export function defineCase(
  c: Pick<EngineeringCase, "number" | "slug" | "category" | "title" | "summary" | "technologies" | "sections">,
): EngineeringCase {
  const get = (...ids: string[]) => c.sections.find((s) => ids.includes(s.id));
  const contribution = get("contribution", "built");
  return {
    ...c,
    context: sectionText(get("context"))!,
    problem: sectionText(get("incident", "what-failed", "constraints")),
    investigation: get("investigation", "reproducing")?.points,
    rootCause: sectionText(get("root-cause")),
    contribution: contribution?.points ?? [sectionText(contribution)!],
    outcome: sectionText(get("result")),
    takeaway: sectionText(get("takeaway"))!,
  };
}
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
  // From the CV, in international format for wa.me links.
  whatsapp: "554499700617",
  location: "Brazil",
  languages: "English C1 Advanced · Portuguese native",
  availability: "Open to select remote international opportunities",
  core: ["Node.js", "TypeScript", "React", "AWS", "Google Cloud Platform"],
  intro:
    "6+ years building and operating production systems across fintech, e-commerce and SaaS, from React applications to backend services supporting millions of users.",
  resumePath: "/resume/Jordao_Qualho_Senior_Software_Engineer_CV.pdf",
};
// Every homepage section, in the order visitors encounter it. The desktop
// header uses a case-study menu for the first section; the mobile menu lists
// every destination directly.
export const navigation = [
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/#projects" },
  { label: "Stack", href: "/#stack" },
  { label: "About", href: "/#about" },
  { label: "AI Agents", href: "/#agents" },
  { label: "Contact", href: "/#contact" },
];
// Each headline number links to the page that backs it up.
export const stats = [
  {
    value: 6,
    suffix: "+",
    label: "years in production",
    detail: "Since 2020 across fintech, e-commerce, SaaS and logistics",
    href: "/#experience",
  },
  {
    value: 7,
    suffix: "M+",
    label: "users on the platform",
    detail: "Financial platform where I traced a masked onboarding failure",
    href: "/work/financial-onboarding-incident/",
  },
  {
    value: 20,
    suffix: "k",
    label: "concurrent users load-tested",
    detail: "After a live event passed 12k, within the same budget",
    href: "/work/live-commerce-traffic-spike/",
  },
  {
    value: 50,
    suffix: "+",
    label: "shared React components",
    detail: "Storybook library across healthcare micro-frontends",
    href: "/work/healthcare-react-component-system/",
  },
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
      "AWS and Google Cloud Platform production environments, including CloudWatch, SQS, CI/CD and the operational work around scaling and incidents.",
  },
];
export const cases: EngineeringCase[] = [
  defineCase({
    number: "01",
    slug: "financial-onboarding-incident",
    category: "Production debugging · Fintech",
    title: "Tracing a masked failure in a financial onboarding flow",
    summary:
      "More than 100 customers failed account creation at once, and every retry returned a provider error that hid the real one. I reconstructed the request sequence from CloudWatch logs, which led the team to the first failure, a fix and the recovery of the affected accounts.",
    technologies: ["Node.js", "TypeScript", "CloudWatch"],
    sections: [
      {
        id: "context",
        heading: "Context",
        body: "A financial platform serving 7M+ users. Account creation depended on an external financial provider, and the backend retried failed provider calls automatically.",
      },
      {
        id: "incident",
        heading: "Incident",
        body: "Around 10 a.m., more than 100 customers failed account creation at nearly the same time. Each of them had been retried more than 10 times, and every retry failed with the same provider response: “Customer Already Exists.”",
      },
      {
        id: "investigation",
        heading: "Investigation",
        ordered: true,
        points: [
          "The Command Center caught the error spike in Grafana. My part was the logs.",
          "In AWS CloudWatch, I rebuilt the sequence of provider calls for affected customers, starting from the first request rather than the latest error.",
          "The first request had failed differently: the provider created the customer but did not complete the account, because the due date was invalid.",
          "That made “Customer Already Exists” a secondary error: the provider was correctly refusing to create the same customer twice.",
          "Teammates who knew the provider's business rules confirmed which due dates it rejected.",
        ],
      },
      {
        id: "root-cause",
        heading: "Root cause",
        points: [
          "Partial creation: on the first call, the provider created the customer and stopped before creating the account.",
          "An undocumented provider rule: the due date could not be later than day 28. Our flow did not enforce it.",
          "Retries masked the cause: each retry repeated customer creation against a customer that now existed, so the provider answered “Customer Already Exists.” The real reason appeared only in the first response, under ten or more identical retry failures.",
        ],
      },
      {
        id: "contribution",
        heading: "My contribution",
        points: [
          "Investigated the CloudWatch logs and reconstructed the request flow for the affected customers.",
          "Identified the invalid due date as the original failure, and “Customer Already Exists” as a side effect of the retries.",
        ],
      },
      {
        id: "fix",
        heading: "Fix and recovery",
        body: "Done as a team:",
        points: [
          "Validation in both frontend and backend, so due dates after day 28 no longer reach the provider.",
          "Automated tests for the day-28 rule.",
          "A recovery script for stuck customers that skipped customer creation, since the provider had already done that step.",
        ],
      },
      {
        id: "result",
        heading: "Result",
        points: [
          "About 100 customers recovered.",
          "Resolved in about 4 hours.",
          "This error stopped generating support tickets after the fix.",
        ],
      },
      {
        id: "takeaway",
        heading: "Engineering takeaway",
        body: "Automatic retries are safe only when the downstream call is all-or-nothing. When a provider can fail halfway, a retry is no longer the same request: it runs against new state and gets a new error. In a chain of calls, find the first failure for one affected request before trusting the error everyone is looking at, and make recovery resume from the step that already succeeded.",
      },
    ],
  }),
  defineCase({
    number: "02",
    slug: "live-commerce-traffic-spike",
    category: "Scalability · Live commerce",
    title: "Handling a 12k-user spike during a live commerce event",
    summary:
      "A live shopping event drew more than 12,000 concurrent users, about twice the usual peak and a load the platform had never been tested at. After keeping the event running, we reproduced the spike with load tests and tuned Cloud Run autoscaling until tests sustained about 20,000 users within the same infrastructure budget.",
    technologies: ["Node.js", "Google Cloud Platform"],
    sections: [
      {
        id: "context",
        heading: "Context",
        body: "A live commerce platform used during live shopping events for a large Brazilian fashion brand. Events usually peaked around 6,000 concurrent users; one passed 12,000. The backend ran on Google Cloud Run after a recent migration from AWS to Google Cloud Platform, and the platform had never been tested at that load.",
      },
      {
        id: "what-failed",
        heading: "What failed",
        points: [
          "The database saturated first, mostly on CPU and memory, and the pressure cascaded through the rest of the infrastructure.",
          "Capacity could not grow fast enough. Thousands of people joined at once, and between cold starts and the autoscaling configuration, new instances arrived after the demand was already there.",
          "The migration was recent, but the problem only showed up at this level of traffic.",
        ],
      },
      {
        id: "response",
        heading: "Immediate response",
        body: "The event was live, so stability came before diagnosis. Resources were raised as an emergency measure to keep the platform up through the event. That bought time, not an explanation.",
      },
      {
        id: "reproducing",
        heading: "Reproducing the failure",
        points: [
          "After the event, we reproduced the load under controlled conditions with Taurus.",
          "Developers simulated thousands of concurrent users, raising the load step by step.",
          "Metrics and logs at each step showed which limits were reached first.",
        ],
      },
      {
        id: "changes",
        heading: "Changes",
        body: "With the infrastructure team, we adjusted infrastructure and Cloud Run autoscaling, retested, and repeated. Each round looked for a balance between enough capacity to absorb thousands of users arriving at once and the cost of keeping that capacity available.",
      },
      {
        id: "contribution",
        heading: "My contribution",
        body: "As a Senior Developer, I worked with the infrastructure team on:",
        points: [
          "Running the Taurus load tests and reading the results against metrics and logs.",
          "Analyzing where the limits were and taking part in each round of autoscaling and capacity changes.",
          "Retesting after every change.",
        ],
      },
      {
        id: "result",
        heading: "Result",
        body: "After the adjustments, load tests sustained about 20,000 concurrent users without exceeding the infrastructure budget defined for that scenario. This is a load-test result, not a later production event.",
      },
      {
        id: "takeaway",
        heading: "Engineering takeaway",
        body: "A spike is a different problem from growth. Autoscaling reacts to demand that already exists, so when thousands of people arrive in the same minute, cold starts decide whether capacity shows up in time. A load test that ramps up gently will pass on a system that fails at a live event; it has to reproduce simultaneous entry. From there, performance is a trade-off between capacity, how fast it reacts, and what it costs to keep ready.",
      },
    ],
  }),
  defineCase({
    number: "03",
    slug: "healthcare-react-component-system",
    category: "Frontend architecture · Healthcare",
    title: "Building a shared React system across healthcare micro-frontends",
    summary:
      "A US healthcare product needed a custom experience for a large hospital client, spread across several React micro-frontends. In a short engagement, I built a Storybook-documented library of 50+ components from the Figma designs, so those frontends could share one UI foundation.",
    technologies: ["React", "TypeScript", "Storybook", "Micro Frontends"],
    sections: [
      {
        id: "context",
        heading: "Context",
        body: "I worked through Tecla on a short engagement for a US healthcare company. Its existing product used audio transcription and AI agents to support care workflows in hospitals, such as organizing clinical information and looking up medical knowledge and papers. A large hospital client asked for a customized experience, which touched several frontends that had to evolve consistently.",
      },
      {
        id: "constraints",
        heading: "Constraints",
        points: [
          "Several applications: a main shell whose menu routed to separate frontends.",
          "Micro-frontends had been chosen before I joined.",
          "Every frontend had to follow the same Figma designs.",
          "Direct work with US-based stakeholders.",
          "A short timeline.",
        ],
      },
      {
        id: "built",
        heading: "What I built",
        points: [
          "A Storybook for the team.",
          "An internal React component library built from the Figma designs: 50+ components, including buttons, inputs, chat and modals.",
          "Integration of the library into the micro-frontends, adapting it where each one needed.",
          "ArgoCD manifests for the new services, adapted from the existing ones by changing the service and resources.",
        ],
      },
      {
        id: "architecture",
        heading: "Architecture: what was mine",
        points: [
          "Already in place: the micro-frontend architecture, the shell routing to separate frontends, and the ArgoCD deployment setup used by other services.",
          "My implementation: the component library, Storybook as the visual reference, the library's integration into the frontends, and the ArgoCD manifests for the new services.",
        ],
      },
      {
        id: "fhir",
        heading: "FHIR data in the UI",
        body: "Part of the domain data followed FHIR, the healthcare interoperability standard used by the backend. I helped adapt the FHIR data the interface needed into a shape the frontend could display.",
      },
      {
        id: "result",
        heading: "Result",
        points: [
          "A shared library of 50+ reusable components in use.",
          "Storybook as the team's reference for visual implementation.",
          "Multiple frontends built on the same foundation.",
          "A working MVP.",
        ],
      },
      {
        id: "ending",
        heading: "Project ending",
        body: "The engagement ended after the client chose not to continue the contract for commercial reasons related to timeline and cost.",
      },
      {
        id: "takeaway",
        heading: "Engineering takeaway",
        body: "Micro-frontends buy independence, but every boundary is also a place where buttons, inputs and modals get rebuilt slightly differently. Without a shared foundation, that independence turns into fragmentation and duplication. One component library with one visual reference lets the frontends stay separate in code and still read as one product.",
      },
    ],
  }),
];
export const experience: Experience[] = [
  {
    company: "Afinz / client Sem Parar",
    title: "Senior Backend Engineer · Contract / B2B",
    dates: "Dec 2023 – Sep 2026",
    summary:
      "Backend engineer and technical reference for a financial-services squad on Sem Parar, a platform with 7M+ active users. I led and trained engineers, coordinated production investigations, worked through API integrations with product stakeholders, and improved testing, documentation and onboarding.",
    technologies: [
      "Node.js",
      "TypeScript",
      "NestJS",
      "REST APIs",
      "Microservices",
      "Technical Leadership",
      "Event-Driven Architecture",
      "AWS",
      "AWS Lambda",
      "CloudWatch",
      "DynamoDB",
      "PostgreSQL",
      "SQS",
      "GitHub Actions",
      "Bitbucket",
      "Distributed Systems",
      "Automated Testing",
      "Jest",
    ],
  },
  {
    company: "Sully",
    title: "Senior Full Stack Engineer · Advisory / B2B",
    dates: "Mar 2026 – Apr 2026",
    summary:
      "Short engagement on a US healthcare product with AI-assisted care workflows. I built a Storybook-documented library of 50+ React components from the Figma designs, integrated it into existing micro-frontends, and adapted deployment manifests for new services.",
    note: "Engagement through Tecla. It ended after the client chose not to continue the contract for commercial reasons related to timeline and cost.",
    technologies: [
      "React",
      "TypeScript",
      "NestJS",
      "Storybook",
      "Micro Frontends",
      "Distributed Systems",
      "MySQL",
      "Vite",
      "Firestore",
      "Google Cloud Platform",
      "Automated Testing",
      "Jest",
    ],
  },
  {
    company: "ROIT GROUP",
    title: "Senior Full Stack Engineer",
    dates: "Jul 2023 – Nov 2023",
    summary:
      "Worked on NestJS microservices for analytical product routes. I designed Redis caching and invalidation, and raised automated test coverage above 85% on the core services.",
    technologies: [
      "React",
      "NestJS",
      "Redis",
      "TypeScript",
      "REST APIs",
      "Microservices",
      "Caching Strategies",
      "Distributed Systems",
      "Google Cloud Platform",
      "Firestore",
      "Pub/Sub",
      "Event-Driven Architecture",
      "Automated Testing",
      "Jest",
    ],
  },
  {
    company: "Voyager Portal",
    title: "Senior Full Stack Engineer",
    dates: "Nov 2022 – Jun 2023",
    summary:
      "Maritime logistics platform built with TypeScript and AdonisJS APIs, plus Vue.js 2, Vuetify and Vuex interfaces backed by MySQL and AWS services. I rebuilt a reporting microservice from Python to TypeScript to cut memory use and stop runtime failures, and built stateful interfaces for operations teams.",
    technologies: [
      "TypeScript",
      "Vue.js",
      "REST APIs",
      "Distributed Systems",
      "AdonisJS",
      "MySQL",
      "AWS",
      "S3",
      "Docker",
      "GitLab CI",
      "WebSockets",
      "Playwright",
      "Automated Testing",
      "Jest",
    ],
  },
  {
    company: "Grupo Soma",
    title: "Full Stack Engineer",
    dates: "Nov 2021 – Nov 2022",
    summary:
      "Live commerce platform on Google Cloud Run. After an event passed 12,000 concurrent users, I worked with the infrastructure team on load tests and autoscaling changes until tests sustained about 20,000 within budget. Later took on Tech Lead responsibilities for a period, including mentoring engineers and code review standards.",
    technologies: [
      "React",
      "JavaScript",
      "Redux",
      "Node.js",
      "Express.js",
      "REST APIs",
      "Google Cloud Platform",
      "PostgreSQL",
      "Storybook",
      "Material UI",
      "WebSockets",
      "Caching Strategies",
      "Pub/Sub",
      "Monolithic Architecture",
      "High-Concurrency Systems",
      "Performance Optimization",
      "Technical Leadership",
      "Automated Testing",
      "Jest",
    ],
  },
  {
    company: "Cria Studio",
    title: "Full Stack Engineer",
    dates: "Aug 2021 – Nov 2021",
    summary:
      "Sole engineer on an interactive 2D product. The MVP started in React and moved to Next.js for the production version, from technical and product decisions through release.",
    technologies: [
      "Next.js",
      "JavaScript",
      "Redux",
      "Material UI",
      "Node.js",
      "Express.js",
      "REST APIs",
      "S3",
      "AWS",
      "Monolithic Architecture",
      "Automated Testing",
      "Jest",
    ],
  },
  {
    company: "Lorena Felicio",
    title: "Full Stack Engineer",
    dates: "Jan 2020 – Aug 2021",
    summary:
      "Built an ERP from scratch with Next.js and React, Node.js, MongoDB and AWS S3, including Brazilian tax and invoicing integrations and automated document workflows.",
    technologies: [
      "Next.js",
      "React",
      "JavaScript",
      "Redux",
      "Node.js",
      "Express.js",
      "REST APIs",
      "MongoDB",
      "S3",
      "AWS",
      "Monolithic Architecture",
      "Automated Testing",
      "Jest",
    ],
  },
];
export const skills = [
  // Within each group: core technologies first, then adjacent frameworks and
  // services, followed by narrower or project-specific evidence.
  {
    group: "Backend",
    items: [
      "Node.js",
      "REST APIs",
      "Express.js",
      "TypeScript",
      "JavaScript",
      "Microservices",
      "NestJS",
      "AdonisJS",
    ],
  },
  {
    group: "Frontend",
    items: [
      "React",
      "Vue.js",
      "Next.js",
      "Redux",
      "Material UI",
      "Storybook",
      "Micro Frontends",
    ],
  },
  {
    group: "Data & Caching",
    items: ["PostgreSQL", "MySQL", "MongoDB", "DynamoDB", "Firestore", "Redis"],
  },
  {
    group: "Cloud & Delivery",
    items: [
      "AWS",
      "Google Cloud Platform",
      "Docker",
      "CloudWatch",
      "S3",
      "AWS Lambda",
      "SQS",
      "Pub/Sub",
      "GitHub Actions",
      "GitLab CI",
      "Bitbucket",
    ],
  },
  {
    group: "Engineering",
    items: [
      "Distributed Systems",
      "Monolithic Architecture",
      "Performance Optimization",
      "High-Concurrency Systems",
      "WebSockets",
      "Event-Driven Architecture",
      "Automated Testing",
      "Jest",
      "Caching Strategies",
      "Technical Leadership",
    ],
  },
  {
    group: "Project Experience",
    items: [
      "Fastify",
      "Socket.IO",
      "Tailwind CSS",
      "PWA",
      "Vercel",
      "MCP",
      "PostHog",
      "Service Worker",
      "GSAP",
    ],
  },
];
// Who I am outside the terminal. Rendered as the rotating line under the hero headline.
export const facets = [
  { id: "violin", label: "violinist in an orchestra" },
  { id: "theology", label: "theology student" },
  { id: "piano", label: "piano player" },
  { id: "dm", label: "dungeon master" },
  { id: "chess", label: "chess player" },
] as const;
export const principles = [
  {
    title: "I debug from evidence, not assumptions.",
    detail: "Logs, traces and production behavior come before hypotheses.",
  },
  {
    title: "Observability should exist before production fails.",
    detail: "A system should tell us what went wrong before a customer has to.",
  },
  {
    title: "AI accelerates engineering; it doesn’t replace understanding.",
    detail:
      "I use agents heavily, but architecture, review and production responsibility remain human decisions.",
  },
];
// Flat form for Markdown, the REST API and MCP, which expose principles as strings.
export const principleStrings = principles.map((p) => `${p.title} ${p.detail}`);
export const lookingFor = {
  roles: "Senior Backend or Full Stack roles",
  focus:
    "where I can work on APIs, performance and production reliability, with remote teams in Brazil, LATAM or internationally.",
};
// Long-form content for a project's own page at /projects/<slug>/.
// Every point comes from the project's public README; nothing is inferred.
export type ProjectDetail = {
  tagline: string;
  overview: string;
  features: string[];
  engineering: string[];
  technologies: string[];
  limits?: string[];
  credit?: string;
  motivation?: string[];
  engineeringIntro?: string;
  engineeringNote?: string;
  callout?: { title: string; body: string };
  image?: { src: string; alt: string; width: number; height: number };
  decision?: string[];
};
export type Project = {
  name: string;
  status: string;
  description: string;
  stack?: string[];
  href?: string;
  byline?: string;
  slug?: string;
  repo?: string;
  detail?: ProjectDetail;
};
export const projects: Project[] = [
  {
    name: "Ana Caroline Hipólito",
    status: "Live",
    description:
      "A professional website for a psychologist, designed around an ethical care journey, local search and a clear first contact.",
    byline:
      "A production site where visual direction, SEO, privacy and real-world contact flows meet.",
    stack: ["Next.js", "React", "TypeScript", "PostgreSQL", "PostHog", "Vercel"],
    href: "https://www.anacarolinehipolito.com.br/",
    slug: "ana-caroline-hipolito",
    detail: {
      tagline: "A professional, search-ready website for a psychologist in Maringá",
      overview:
        "Ana Caroline Hipólito is a psychologist who works with adolescents from 13 and adults through Gestalt therapy, both in person in Maringá and online. I built the site to give her work an owned, professional presence beyond Instagram and third-party profiles, while making the path from discovering her work to starting a conversation feel calm and clear.",
      features: [
        "Institutional pages for Home, About, Psychotherapy, Maringá, Online Care and Contact.",
        "A local landing page for people searching for a psychologist in Maringá.",
        "A first-contact form, WhatsApp paths, a dedicated links page and a QR-code route for offline materials.",
        "A protected administrative area for organizing incoming contacts without turning the website into a clinical record.",
        "Privacy policy and content written around the ethical context of Psychology, without promises of results or aggressive conversion language.",
      ],
      motivation: [
        "Before the project, Ana's digital presence lived mainly on Instagram and third-party channels. The site creates an owned space that explains her work with more context and gives search visitors a direct, trustworthy next step.",
        "The experience is designed around the actual journey of someone considering psychotherapy: understand the approach, see whether the format fits, and choose WhatsApp or a first-contact form without navigating a complex website.",
      ],
      engineering: [
        "Built with Next.js, React and TypeScript, then deployed on Vercel under anacarolinehipolito.com.br.",
        "Neon Postgres stores first-contact submissions, while a protected admin area gives Ana a practical way to organize them.",
        "PostHog and Vercel Analytics measure behavior without turning the form into a source of sensitive clinical data.",
        "Technical SEO is part of the implementation: sitemap, canonical URLs, Open Graph metadata and structured data support the local search journey.",
        "Responsive, semantic pages were built for desktop and mobile, with performance and accessible content structure considered from the start.",
      ],
      callout: {
        title: "A real result beyond the launch.",
        body: "The site already generated a patient contact that became a paid first engagement. It has also produced measurable traffic, contact interactions and form submissions, although the current data is not enough to attribute every new patient directly to the website.",
      },
      limits: [
        "The site does not promise therapeutic outcomes or use aggressive commercial language.",
        "Analytics are kept separate from sensitive clinical information; the form is for first contact, not a clinical record.",
        "The case uses aggregated contact and traffic outcomes rather than publishing private patient details.",
      ],
      technologies: [
        "Next.js",
        "React",
        "TypeScript",
        "PostgreSQL",
        "PostHog",
        "Vercel",
      ],
      image: {
        src: "/projects/anacaroline.png",
        alt: "Homepage of Ana Caroline Hipólito's psychology practice website, with a calm editorial layout and a portrait-led introduction.",
        width: 3192,
        height: 1895,
      },
    },
  },
  {
    name: "Bombinhas",
    status: "Beta",
    description:
      "A private, mobile-first trip planner for six friends, bringing the itinerary, votes, expenses, shopping and responsibilities into one place.",
    byline:
      "A real coordination problem turned into a small product with shared state and financial logic.",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
    ],
    href: "https://bombinhas.vercel.app/",
    slug: "bombinhas",
    detail: {
      tagline: "A private trip planner for six friends heading to Bombinhas",
      overview:
        "Bombinhas is a small private app for six adults planning a beach trip together. Before it existed, decisions about the itinerary, food, shopping, accommodation and payments lived in chat. The app turns those conversations into one shared place where the group can plan, vote, record expenses and see what still needs to happen.",
      features: [
        "A daily itinerary with activities and voting for what the group should do.",
        "Shared expenses with each person's paid amount, expected share and current balance.",
        "A settlement algorithm planned to reduce the final balance to the smallest practical number of transfers.",
        "Shopping, meal planning and a checklist of what each person is responsible for bringing.",
        "Accommodation details and shared costs, with Google Maps links for the house and itinerary locations.",
        "A mobile-first navigation bar and quick actions designed for 375–430px phones.",
      ],
      motivation: [
        "The goal was not to build another generic travel dashboard. It was to remove the repeated questions and manual arithmetic that make group trips harder to coordinate.",
        "The app is private to the group for now, with the possibility of making the pattern reusable for other trips after the first real use.",
      ],
      engineering: [
        "The app uses Next.js App Router, React, TypeScript, Server Actions, Tailwind CSS, shadcn/ui and Zod, with the frontend and backend handled by Next.js.",
        "The first persistence layer uses Vercel Blob because the initial scope is small and limited to one private trip; a Supabase or Neon migration is planned before wider use as the Blob model approaches its practical limit.",
        "Participants choose a name and use a four-digit PIN. PINs are hashed, sessions use signed HTTP-only cookies, and the app distinguishes member and admin roles.",
        "Trip records are split into independent resources instead of one shared JSON file, reducing write conflicts when people vote, add expenses or mark shopping items at the same time.",
        "Server-side Zod validation and financial tests cover equal splits, cent rounding, custom divisions, balances and debt simplification.",
        "The deployment target is Vercel, with infrastructure credentials kept in environment variables rather than in the client.",
      ],
      callout: {
        title: "A product before the vacation starts.",
        body: "The case is currently in specification and construction. The expected value is less time searching old messages, recalculating balances and asking who is bringing or paying for something; real usage and savings have not been measured yet.",
      },
      limits: [
        "The app has not yet been validated by the full group in a real trip.",
        "There is no payment integration, climate integration or WhatsApp/Spreadsheet sync; the app organizes the data but does not move money.",
        "A backup strategy is still to be defined before the app becomes a reusable product.",
        "Personal details are intentionally limited; property-owner CPF and unnecessary contract data are not exposed.",
      ],
      technologies: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
      ],
      image: {
        src: "/projects/bombinhas.png",
        alt: "Bombinhas trip planner interface showing the shared itinerary and coordination tools for a group beach trip.",
        width: 3193,
        height: 1891,
      },
    },
  },
  {
    name: "Akaashi",
    status: "Live",
    description:
      "An independent design and technology studio creating authored digital experiences for businesses that want to be remembered.",
    byline:
      "Custom websites and digital experiences for businesses in Maringá and beyond.",
    stack: ["JavaScript", "GSAP", "Vercel"],
    href: "https://www.akaashi.com.br/",
    slug: "akaashi",
    detail: {
      tagline: "A design and technology studio for digital products that leave a mark",
      overview:
        "Akaashi is an independent design and technology studio creating authored digital experiences for businesses that want to be remembered. It starts with the idea at the center of a business and turns that idea into a visual concept, interaction and web experience instead of reaching for a generic template. The studio begins with local businesses and companies in Maringá and the surrounding region whose real quality is ahead of their digital presence.",
      features: [
        "Custom institutional websites as the studio's primary service.",
        "Redesigns, landing pages and digital experiences with a distinct visual direction.",
        "Digital applications of an existing brand identity, plus related graphic materials.",
        "A clear path from diagnosis and concept to proposal, development, launch and support.",
        "Responsive websites with semantic HTML, metadata, technical SEO and performance work.",
        "Contact, WhatsApp, analytics, database and administrative integrations when a project needs them.",
        "Public work and MVPs include Vercelli Pasticceria, Igreja Batista Vila 7, Amaral's Pizzaria, Colha, Fica Leve, The Kingdom and Special Guest For You.",
      ],
      motivation: [
        "Many good businesses have a digital presence that is generic, outdated or weaker than the real business behind it. Akaashi exists to close that gap.",
        "Fica Leve and Special Guest For You represent the studio's desired direction: take one central characteristic of the business and turn it into a digital experience of its own.",
      ],
      engineering: [
        "Projects move from contact or referral through diagnosis, research, concept or MVP, commercial validation, proposal, development, review, adjustments, launch and support.",
        "Discovery, content structure, UX, UI, development, publication and maintenance are handled as one connected process.",
        "The stack changes with the project: lightweight HTML, CSS and JavaScript for focused sites, or React, Next.js, TypeScript, databases and integrations for more complex products.",
        "GSAP and Lenis are used when motion supports the concept rather than as decoration.",
        "Sites are developed responsively with semantic HTML, heading structure, metadata, optimized assets, technical SEO and performance checks; own projects have reached Lighthouse scores close to 100.",
        "Publication is primarily through Vercel, with domains, DNS, existing infrastructure and maintenance considered before and after launch.",
      ],
      limits: [
        "Prices are negotiated per project and are not public.",
        "The studio is currently focused on institutional websites and web experiences, with more complex applications handled when the project calls for them.",
        "Client materials and commercial process details remain private unless explicitly approved for publication.",
      ],
      callout: {
        title: "From concept to commercial delivery.",
        body: "Vercelli Pasticceria was the studio's first approved and paid commercial project. Other public work and MVPs are at different stages of validation and delivery.",
      },
      technologies: [
        "JavaScript",
        "GSAP",
        "React",
        "Next.js",
        "TypeScript",
        "Vercel",
      ],
      image: {
        src: "/projects/akaashi.png",
        alt: "Akaashi studio homepage with an editorial cream layout, oversized wordmark, red hand-drawn line and calls to start a project or view the work.",
        width: 3182,
        height: 1893,
      },
    },
  },
  {
    name: "Koinon Games",
    status: "Beta",
    description:
      "A mobile-first PWA that turns card and social-deduction games into shared rooms anyone can join from a phone. Tested with 50+ people across 100+ games.",
    byline:
      "Product direction and game design by me; implementation accelerated with coding agents in a private monorepo.",
    stack: ["React", "Vite", "TypeScript", "Fastify", "Socket.IO", "PWA"],
    href: "https://koinongames.vercel.app/",
    slug: "koinon-games",
    detail: {
      tagline: "Synchronous tabletop games for groups, cells and friends",
      overview:
        "Koinon Games is a digital tabletop platform for groups that want to play together without carrying a deck of cards or remembering to bring a game. The name comes from koinon, communion: the product is about making a shared activity easy to start. Anyone with a phone can join a room through a QR code or room ID and play over the internet. The initial audience was churches and friend groups, but the product is designed for any group. The first games are O Judas, where disciples identify the traitor through secret words, and Os Fofoqueiros, where believers protect secrets while saboteurs try to disrupt missions.",
      features: [
        "O Judas: a social-deduction game in which disciples use secret words to identify the traitor.",
        "Os Fofoqueiros: a trust-and-betrayal game in which believers protect secrets and gossipers sabotage missions.",
        "Rooms that can be joined from the home screen with a QR code or room ID.",
        "Synchronous rooms with real-time player and game-state updates.",
        "Mobile-first PWA interface designed for use during an in-person gathering.",
        "Christian and non-Christian themes, depending on the group's preference.",
        "Shared TypeScript types for players, rooms, themes and Socket.IO events.",
      ],
      motivation: [
        "The product removes the friction of bringing a physical game: if everyone has a phone and internet access, the group can start playing anywhere.",
        "The original audience was churches and friend groups, but the underlying format is useful for any group that wants a shared game without a moderator carrying all the materials.",
        "The product direction, game design and decisions about the experience were mine; coding agents accelerated the implementation inside a private monorepo.",
      ],
      engineering: [
        "The web app uses React, Vite and TypeScript, with Tailwind CSS for styling and PWA support for offline-capable experiences.",
        "The backend uses Node.js, Fastify and Socket.IO for HTTP endpoints and real-time game communication.",
        "A pnpm-workspaces monorepo keeps the web app, server and packages/shared together.",
        "The shared package defines the contracts used by both sides, including Player, Room, Theme and GameEventMap.",
        "Rooms live in server memory and expire after enough inactivity, avoiding accounts and persistence while keeping active games simple.",
        "Validation protects against repeated or out-of-order events, while a reconnection tolerance gives disconnected players time to return.",
        "The hardest engineering work was handling different connection conditions and keeping controls usable across different phone sizes.",
        "The frontend is deployed to Vercel and the backend runs on Railway, with CORS, environment secrets and production configuration kept in the respective platforms.",
        "There is no monitoring or health-check layer yet because the beta is still small; the current priority is fixing edge cases found in playtests.",
      ],
      callout: {
        title: "More than a prototype on paper.",
        body: "More than 50 people have already played across 100+ games. The product is still in beta, but the core loop—join a room, synchronize a group and play on phones—has been tested in real gatherings.",
      },
      technologies: [
        "React",
        "Vite",
        "TypeScript",
        "Node.js",
        "Fastify",
        "Socket.IO",
        "Tailwind CSS",
        "PWA",
      ],
      limits: [
        "The repository is private.",
        "The product is in beta and still receives fixes as new gaps are found, especially around connectivity and responsive controls.",
        "The first release focuses on O Judas and Os Fofoqueiros; the game catalog can grow later.",
        "The platform is designed for synchronous groups rather than asynchronous matchmaking.",
        "Rooms are held in server memory and there are no accounts or persistent player profiles; only a chosen name and local preferences remain on the device.",
      ],
      image: {
        src: "/projects/koinon.png",
        alt: "Koinon Games interface showing a mobile-first shared room for social-deduction games.",
        width: 3192,
        height: 1893,
      },
    },
  },
  {
    name: "iMemory",
    status: "Public",
    description:
      "A local dashboard for memory shared across coding agents. Search what they remember, inspect session handoffs and clean up context without touching the underlying database.",
    byline: "Built as a web interface for Fabio Akita's open-source ai-memory MCP server.",
    stack: ["JavaScript", "MCP"],
    href: "https://github.com/jordaoqualho/imemory",
    slug: "imemory",
    repo: "https://github.com/jordaoqualho/imemory",
    detail: {
      tagline: "A local control center for the long-term memory shared by coding agents",
      image: {
        src: "/projects/imemory.png",
        alt: "iMemory overview screen: project switcher, search, counters for saved memories, sessions, captured events and pending handoffs, and lists of recent memories and handoffs ready to continue.",
        width: 1258,
        height: 983,
      },
      overview:
        "iMemory is a web interface for ai-memory, Fabio Akita's open-source MCP server for persistent, local memory across coding agents. Instead of giving each agent an isolated context, ai-memory lets Claude Code and other MCP-compatible agents reuse the same memories, session handoffs and project knowledge on your own machine. iMemory turns that engine into a practical dashboard: one place to inspect what agents remember, search across projects, review past sessions and manage the memory they share. It does not fork or replace ai-memory. The server remains the source of truth and mounts iMemory as its web interface through --web-ui-dir.",
      features: [
        "Shows projects, recent memories and search in one overview.",
        "Lets you inspect the memories associated with each project.",
        "Makes agent sessions and handoffs visible instead of leaving them hidden in tooling.",
        "Provides cleanup with a preview before changes are applied.",
        "Supports deletion with undo.",
        "Lets you explicitly save the current session when you want an agent's context preserved.",
      ],
      motivation: [
        "When I started using multiple coding agents, the main problem was not generating code. It was keeping context consistent between them. A decision made in one session could be missing from the next tool, and reconstructing it wastes time and tokens and makes handoffs less reliable.",
        "ai-memory solves storage and retrieval. I built iMemory to make that shared memory observable and manageable: to see what is being remembered, which sessions created it, and to clean it up without working directly with internal files or databases.",
      ],
      callout: {
        title: "One source of truth.",
        body: "The UI does not bypass the memory engine: reads use the public API, and writes follow the same MCP path used by agents.",
      },
      engineeringIntro: "The interface stays deliberately thin.",
      engineering: [
        "Reads use ai-memory's public REST API under /api/v1.",
        "Mutating operations use the same MCP tools exposed to coding agents, instead of adding a private write path.",
        "The UI is plain HTML, CSS and JavaScript with no frontend build step.",
        "The ai-memory server serves the interface itself through --web-ui-dir.",
        "The repository can also act as the local ai-memory data directory.",
      ],
      engineeringNote:
        "That last part meant treating local data as sensitive by default. A deny-by-default .gitignore lets only the interface, documentation and public assets into Git, while the memory database, wiki, configuration, logs, backups and local project data stay on the machine.",
      decision: [
        "iMemory is intentionally not a fork. The server, hooks, memory engine and MCP implementation continue to come from akitaonrails/ai-memory. That keeps the project small and lets the interface evolve without duplicating the underlying memory system.",
      ],
      technologies: ["JavaScript", "MCP", "REST APIs"],
      credit: "Built against ai-memory v2.4. The engine and its license (MIT) belong to akitaonrails/ai-memory.",
    },
  },
  {
    name: "Roundkeep",
    status: "Live",
    description:
      "A local combat table for D&D 5e. Initiative, an offline SRD library, Improved Initiative import, and a player view on the same network. No account and no cloud.",
    stack: ["TypeScript", "Socket.IO", "PWA"],
    href: "https://roundkeep.vercel.app",
    slug: "roundkeep",
    repo: "https://github.com/jordaoqualho/roundkeep",
    detail: {
      tagline: "A D&D 5e combat table that keeps working without internet",
      image: {
        src: "/projects/roundkeep.png",
        alt: "Roundkeep encounter screen: creature library on the left, initiative order with HP and armor class in the middle, and the selected creature's stat sheet on the right.",
        width: 2400,
        height: 1433,
      },
      overview:
        "Roundkeep runs a D&D 5e fight in the browser: initiative, HP, conditions, and a library of SRD creatures and spells. It runs on the Dungeon Master's machine, with no account and no cloud, and players follow the combat from their phones on the same network.",
      features: [
        "Combat table with turns, rounds, editable initiative, damage, healing, temporary HP and conditions.",
        "Offline library with 331 SRD 2024 creatures and 319 spells.",
        "Import from Improved Initiative or Roundkeep backups, with a review step before anything is saved.",
        "Player view at /p/{id} for phones on the local network.",
        "Portable JSON backups to move a campaign to another device.",
        "Keyboard shortcuts for next turn, library search, dice and undo.",
      ],
      engineering: [
        "The player view updates live over Socket.IO on the LAN, with a BroadcastChannel fallback inside the same browser.",
        "Catalogs live in IndexedDB and the encounter saves on every change. After the first load, a service worker makes the production build work offline, with cache versions generated at build time.",
        "Web Locks allow only one Dungeon Master tab to edit the campaign at a time, so two tabs never overwrite each other. Player windows stay open in parallel.",
        "The table binds to the LAN, but the bootstrap endpoint that serves private campaign data only answers on loopback. It is not a public cloud room.",
        "The SRD catalog is converted from Open5e v2 by a reproducible Python script, with credits and licenses shipped inside the app.",
        "Tests cover encounter rules, catalog data and import.",
      ],
      technologies: [
        "TypeScript",
        "Socket.IO",
        "Service Worker",
        "PWA",
      ],
      credit:
        "Creature records come from SRD 5.2 (2024) via Open5e under CC BY 4.0. Spells come from the basic catalog distributed by Improved Initiative.",
    },
  },
  {
    name: "Deadfolio",
    status: "Live",
    description:
      "Finds abandoned GitHub repositories, scores them, and writes an evidence-based autopsy. The only thing a person adds is why they actually stopped.",
    stack: ["Next.js", "TypeScript"],
    href: "https://deadfolio.vercel.app",
    slug: "deadfolio",
    repo: "https://github.com/jordaoqualho/deadfolio",
    detail: {
      tagline: "An autopsy for the GitHub projects you left behind",
      image: {
        src: "/projects/deadfolio.png",
        alt: "Deadfolio home page in Brazilian Portuguese: headline saying your GitHub is full of projects left behind and Deadfolio finds them, with buttons to analyze a GitHub profile or paste a repository.",
        width: 2400,
        height: 1435,
      },
      overview:
        "Paste a public GitHub username and Deadfolio scores every public repository for signs of abandonment. On the ones worth a look, it runs an AI autopsy built from the repository's own evidence. Nobody is asked about their stack, project age or activity, because the repository already knows. The one question a person answers is why they actually stopped. The app is available in English and Brazilian Portuguese.",
      features: [
        "Scan: a Dead Score from 0 to 100 for each public repository, from metadata only. No AI runs at this step.",
        "Autopsy: one Gemini generation per repository, validated against a strict schema and always ending with a “What We Cannot Know” section.",
        "Confirm: the creator says whether the inferred cause of death is right and can correct it in one sentence.",
        "Graveyard: published records, labeled UNVERIFIED because repository ownership is not verified.",
      ],
      engineering: [
        "The Dead Score is deterministic and configurable: an inactivity ramp, archive status, and short bursts followed by silence. Forks, templates and experiments are kept apart, and the interface calls the score a heuristic, never a probability.",
        "The prompt treats repository text as untrusted data and keeps evidence, inference and unknowns separate. The model may not invent users, revenue or the real reason development stopped.",
        "Evidence collection ranks files deterministically, never fetches secrets, lockfiles or build output, and scrubs key-like strings before anything reaches the model.",
        "Reports are cached by repository and default-branch commit, so a repeat visit makes no AI call. A new commit triggers an offer to run a fresh autopsy.",
        "Abuse limits include a per-IP daily quota stored as a salted hash, one concurrent autopsy per IP, a global hourly guard, and a quota refund when the AI provider is at capacity.",
        "It is one Next.js app with no database: a key/value layer writes to the filesystem locally and to a private Vercel Blob store in production.",
      ],
      technologies: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
      ],
      limits: [
        "No accounts, payments, notifications or moderation, on purpose.",
        "Only public repositories are analyzed.",
        "Ownership is not verified, so every published record is labeled UNVERIFIED.",
      ],
    },
  },
  {
    name: "Fintal",
    status: "Live",
    description:
      "A personal finance dashboard built on bank CSV exports instead of bank logins. Imports Nubank, C6 and Wise statements, categorizes spending and tracks installments, subscriptions and budgets.",
    stack: ["Next.js", "TypeScript", "NestJS"],
    href: "https://fintalapp.vercel.app",
    slug: "fintal",
    detail: {
      tagline: "Personal finance insights from bank exports, without bank passwords",
      image: {
        src: "/projects/fintal.png",
        alt: "Fintal insights screen in Brazilian Portuguese: a financial health score gauge, a month-over-month chart of income, expenses and balance with forecast months, and budget progress against the monthly limit.",
        width: 2400,
        height: 1433,
      },
      overview:
        "Fintal is a privacy-focused personal finance app. Instead of asking for bank credentials, it imports the CSV exports banks already provide, organizes transactions, installments and subscriptions, and turns them into a dashboard of trends, budgets and diagnostics.",
      features: [
        "CSV import with automatic format detection for Nubank, C6 Bank and Wise (including multi-currency ZIP exports), and column mapping for other banks.",
        "Automatic categorization, with custom categories.",
        "Accounts and cards, and a transaction list with search, filters, bulk edit and infinite scroll.",
        "Installments and subscriptions tracked as recurring spend.",
        "A dashboard with a financial health score, month-over-month charts, an intensity heatmap and category breakdowns.",
        "Privacy mode that blurs every monetary value in the app, toggled from the header or with P.",
        "Command palette (⌘K) and global keyboard shortcuts, guided onboarding missions, and an installable PWA.",
      ],
      engineering: [
        "No bank login: data enters only through files the user exports, parsed by bank-specific detectors with a generic column-mapping fallback.",
        "Privacy mode is a React context persisted in localStorage. It sets a data attribute on the document, and a PrivacyAmount wrapper applies the blur in CSS, so any amount on any screen can be hidden consistently.",
        "Theme preference (light, dark or system) is applied by a boot script before first paint, and Tailwind runs in class mode so the app's choice wins over the operating system's.",
        "The Next.js App Router frontend talks to a NestJS API. Sign-in uses Google OAuth with JWT.",
        "Quality gates: ESLint, Prettier, Vitest unit tests and Playwright end-to-end tests, with Husky running lint, type-check and a full build before every push.",
      ],
      technologies: [
        "Next.js",
        "TypeScript",
        "NestJS",
        "Tailwind CSS",
        "Playwright",
      ],
    },
  },
  {
    name: "Agent-readable portfolio",
    status: "Live",
    description:
      "This site. An MCP server, OpenAPI REST API and llms.txt over the same verified profile, so recruiters' AI assistants answer from facts.",
    stack: ["Next.js", "TypeScript", "MCP"],
    href: "/agents/",
  },
];
export const currentlyBuilding =
  "Currently experimenting with AI-assisted development workflows, shared agent memory and developer tooling.";
export const about = [
  "I’m a Senior Software Engineer based in Brazil, with 6+ years of production experience across fintech, e-commerce, SaaS and logistics. I work in English (C1) with remote teams in LATAM and the US.",
  "My work is Full Stack, with more time spent on backend systems, APIs, cloud infrastructure and production reliability.",
  "I do best on teams that expect engineers to investigate real production behavior and take part in technical decisions, not just close tickets.",
  "Outside engineering, I play violin in an orchestra, study Theology, play piano, run D&D as a dungeon master, and play chess.",
];
export const contact = {
  title: "Looking for a Senior Software Engineer?",
  description:
    "Open to select Senior Backend and Full Stack opportunities with international remote teams.",
};
