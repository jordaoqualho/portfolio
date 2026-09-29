import { profile } from "./profile";

export const privacy = {
  updated: "September 29, 2026",
  intro:
    "This is a personal portfolio. There are no accounts, forms, ads or payments, and no data is sold or shared for marketing.",
  sections: [
    {
      id: "analytics",
      title: "Analytics",
      body: "The site uses PostHog to see how pages are used: pages viewed, referrer, browser and device type, and an approximate location derived from the IP address. PostHog keeps an anonymous identifier in a cookie and local storage so repeat visits are counted once. Visitors are never identified by name or email.",
    },
    {
      id: "browser-storage",
      title: "Stored in your browser",
      body: "Your theme and motion preferences are saved in local storage, and a session flag stops the intro animation from replaying. None of it is sent anywhere.",
    },
    {
      id: "hosting",
      title: "Hosting and machine access",
      body: "The site is hosted on Vercel, which keeps standard request logs (IP address, user agent, time). The llms.txt files, Markdown pages and MCP endpoint serve the same public information as the site. They are read-only and store nothing you send, including job descriptions passed to the MCP tools.",
    },
    {
      id: "contact",
      title: "Questions",
      body: `For questions or to ask for analytics data about your visits to be deleted, email ${profile.email}.`,
    },
  ],
};
