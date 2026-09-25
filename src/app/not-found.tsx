import Link from "next/link";
import { PageTransition } from "@/components/motion/PageTransition";
import { BACK } from "@/lib/motion";
export default function NotFound() {
  return (
    <PageTransition>
      <main id="main-content" className="not-found">
        <div className="container">
          <span className="eyebrow">404 / PAGE NOT FOUND</span>
          <h1>This page isn’t here.</h1>
          <p>
            You can find my engineering cases and experience on the homepage.
          </p>
          <Link className="button primary" href="/" transitionTypes={[BACK]}>
            Back to my profile
          </Link>
        </div>
      </main>
    </PageTransition>
  );
}
