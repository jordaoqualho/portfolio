"use client";

import { useEffect } from "react";

export function SiteLoader() {
  useEffect(() => {
    const root = document.documentElement;
    let timer: ReturnType<typeof setTimeout>;
    const finish = () => {
      clearTimeout(timer);
      root.dataset.loading = "ready";
      window.dispatchEvent(new Event("portfolio-ready"));
    };
    const onLoad = () => {
      // A brief exit lets the mark settle without waiting for third-party scripts.
      timer = setTimeout(finish, 180);
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    // Never cover content when someone starts using the page.
    window.addEventListener("keydown", finish, { once: true });
    window.addEventListener("pointerdown", finish, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("keydown", finish);
      window.removeEventListener("pointerdown", finish);
    };
  }, []);

  return (
    <div className="site-loader" aria-hidden="true">
      <div className="loader-content">
        <span className="wordmark">jq<span>.</span></span>
        <span className="loader-track"><span /></span>
        <span className="loader-label">Loading portfolio</span>
      </div>
    </div>
  );
}
