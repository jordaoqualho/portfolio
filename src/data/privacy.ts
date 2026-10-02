import { profile } from "./profile";

export const privacy = {
  updated: "September 29, 2026",
  intro:
    "This is a personal portfolio. There are no accounts, ads or payments, and no data is sold or shared for marketing.",
  sections: [
    {
      id: "analytics",
      title: "Analytics",
      body: "The site uses PostHog to see how pages are used: pages viewed, referrer, browser and device type, and an approximate location derived from the IP address. PostHog keeps an anonymous identifier in a cookie and local storage so repeat visits are counted once. Visitors are never identified by name or email.",
    },
    {
      id: "contact-form",
      title: "Contact form",
      body: "Messages sent through the contact form (name, email, optional company and message) are delivered to my inbox through Resend, an email provider, and are used only to reply to you. They are not stored on this site or added to any list.",
    },
    {
      id: "browser-storage",
      title: "Stored in your browser",
      body: "Your theme, language and motion preferences are saved in local storage and a language cookie, and a session flag stops the intro animation from replaying. None of it is sent anywhere beyond this site.",
    },
    {
      id: "hosting",
      title: "Hosting and machine access",
      body: "The site is hosted on Vercel, which keeps standard request logs (IP address, user agent, time). The approximate country of a request is only used to pick the language on a first visit. The llms.txt files, Markdown pages and MCP endpoint serve the same public information as the site. They are read-only and store nothing you send, including job descriptions passed to the MCP tools.",
    },
    {
      id: "contact",
      title: "Questions",
      body: `For questions or to ask for analytics data about your visits to be deleted, email ${profile.email}.`,
    },
  ],
};
