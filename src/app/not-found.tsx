import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content" className="container not-found">
      <span className="eyebrow">404 / PAGE NOT FOUND</span>
      <h1>This page isn’t here.</h1>
      <p>You can find my engineering cases and experience on the homepage.</p>
      <Link className="button primary" href="/">
        Back to my profile
      </Link>
    </main>
  );
}
