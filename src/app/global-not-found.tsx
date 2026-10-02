import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// For URLs outside every route (the [lang] root layout never rendered).
// It bypasses the layout, so it brings its own fonts, theme and copy.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "404 · Jordão Qualho",
  description: "This page isn’t here.",
};

const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark')t=null;document.documentElement.dataset.theme=t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}})()`;

export default function GlobalNotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${geist.variable} ${mono.variable}`}>
        <main id="main-content" className="not-found">
          <div className="container">
            <span className="eyebrow">404 / PAGE NOT FOUND</span>
            <h1>This page isn’t here.</h1>
            <p>
              You can find my engineering cases and experience on the homepage.
              <br />
              <span lang="pt-BR">
                Meus cases e minha experiência estão na página inicial.
              </span>
            </p>
            <Link className="button primary" href="/">
              Back to my profile
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
