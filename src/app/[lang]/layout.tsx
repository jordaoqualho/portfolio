import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteLoader } from "@/components/layout/SiteLoader";
import { MotionController } from "@/components/motion/MotionController";
import { profile } from "@/data/profile";
import { siteUrl, siteCopy } from "@/lib/site";
import { isLocale, localeMeta, locales, type Locale } from "@/i18n/config";
import { I18nProvider } from "@/i18n/provider";
import { localeAlternates, ogLocale } from "@/i18n/metadata";
import { ui } from "@/i18n/ui";
import { workMenuItems } from "@/data/content";
import "../globals.css";
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}
type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const { title, description } = siteCopy[locale];
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: "%s · Jordão Qualho" },
    description,
    keywords: [
      "Senior Software Engineer",
      "Engenheiro de Software Sênior",
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
    alternates: localeAlternates(locale, "/", "/index.md"),
    openGraph: {
      type: "website",
      ...ogLocale(locale),
      siteName: "Jordão Qualho",
      title,
      description,
      url: locale === "en" ? "/" : "/pt/",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
// Theme preference: "light" | "dark" | absent/"system" (follow the OS).
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark')t=null;document.documentElement.dataset.motion=localStorage.getItem('motion')==='paused'?'paused':'enabled';document.documentElement.dataset.theme=t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}})()`;
// Runs before paint. The intro plays once per session; the timeout releases the
// overlay even if hydration never happens.
// After a language switch the new page fades in instead of replaying the intro.
const localeScript = `(function(){try{if(!sessionStorage.getItem('locale-switch'))return;sessionStorage.removeItem('locale-switch');var r=document.documentElement;r.dataset.localeEntering='';setTimeout(function(){delete r.dataset.localeEntering},900)}catch(e){}})()`;
const loadingScript = `(function(){var r=document.documentElement;try{if(sessionStorage.getItem('intro-seen'))return}catch(e){}if(r.dataset.motion==='paused'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;r.dataset.loading='pending';setTimeout(function(){if(r.dataset.loading!=='pending')return;r.dataset.loading='ready';window.dispatchEvent(new Event('portfolio-ready'))},4500)})()`;
export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ lang: string }> }>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang;
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    description: siteCopy[locale].description,
    url: siteUrl,
    email: `mailto:${profile.email}`,
    image: `${siteUrl}/portrait.webp`,
    homeLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressCountry: "BR" },
    },
    knowsLanguage: ["en", "pt-BR"],
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
    <html
      lang={localeMeta[locale].lang}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: localeScript }} />
        <script dangerouslySetInnerHTML={{ __html: loadingScript }} />
        {/* RFC 8631 / RFC 9727 discovery for agents looking for the API. */}
        <link
          rel="service-desc"
          type="application/vnd.oai.openapi+json"
          href="/openapi.json"
        />
        <link rel="service-doc" type="text/html" href="/developers/" />
        <link
          rel="api-catalog"
          type="application/linkset+json"
          href="/.well-known/api-catalog"
        />
      </head>
      <body className={`${geist.variable} ${mono.variable}`}>
        <I18nProvider locale={locale}>
          <SiteLoader />
          <MotionController />
          <a href="#main-content" className="skip-link">
            {ui(locale).skipLink}
          </a>
          <Header menu={workMenuItems(locale)} />
          {children}
          <Footer locale={locale} />
        </I18nProvider>
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
