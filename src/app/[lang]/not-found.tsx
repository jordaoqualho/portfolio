"use client";
import Link from "next/link";
import { PageTransition } from "@/components/motion/PageTransition";
import { BACK } from "@/lib/motion";
import { localePath } from "@/i18n/paths";
import { useLocale, useUi } from "@/i18n/provider";
// not-found receives no params; the locale comes from the [lang] layout.
export default function NotFound() {
  const t = useUi().notFound;
  const locale = useLocale();
  return (
    <PageTransition>
      <main id="main-content" className="not-found">
        <div className="container">
          <span className="eyebrow">{t.eyebrow}</span>
          <h1>{t.title}</h1>
          <p>{t.body}</p>
          <Link
            className="button primary"
            href={localePath(locale, "/")}
            transitionTypes={[BACK]}
          >
            {t.back}
          </Link>
        </div>
      </main>
    </PageTransition>
  );
}
