import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { profile } from "@/data/profile";
import { siteUrl, siteTitle, siteDescription } from "@/lib/site";
import "./globals.css";
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: "%s — Jordão Qualho" },
  description: siteDescription,
  keywords: [
    "Senior Software Engineer",
    "Node.js",
    "TypeScript",
    "React",
    "Next.js",
    "AWS",
    "GCP",
    "Backend Engineer",
    "Full Stack Engineer",
    "Brazil",
    "Remote Software Engineer",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Jordão Qualho",
    title: siteTitle,
    description: siteDescription,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};
const themeScript = `(function(){try{var t=localStorage.getItem('theme');document.documentElement.dataset.motion=localStorage.getItem('motion')==='paused'?'paused':'enabled';document.documentElement.dataset.theme=t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}})()`;
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    url: siteUrl,
    sameAs: [profile.linkedin, profile.github],
    knowsAbout: [
      "Node.js",
      "TypeScript",
      "React",
      "AWS",
      "GCP",
      "Backend Engineering",
      "Production Reliability",
    ],
  };
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${geist.variable} ${mono.variable}`}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(person).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
