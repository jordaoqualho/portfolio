import { defaultLocale, englishOnly, type Locale } from "./config";

// Prefixes an internal path for a locale: "/#work" -> "/pt/#work",
// "/work/x/" -> "/pt/work/x/". External URLs pass through untouched.
export function localePath(locale: Locale, path: string) {
  if (!path.startsWith("/") || locale === defaultLocale) return path;
  // Agent and developer docs exist only in English.
  if (englishOnly.some((page) => path === page || path.startsWith(`${page}/`))) return path;
  if (path === "/") return "/pt/";
  if (path.startsWith("/#")) return `/pt/${path.slice(1)}`;
  return `/pt${path}`;
}

// Removes the locale prefix: "/pt/work/x/" -> "/work/x/".
export function stripLocale(pathname: string) {
  if (pathname === "/pt" || pathname === "/pt/") return "/";
  return pathname.startsWith("/pt/") ? pathname.slice(3) : pathname;
}

// The same page in another locale, for the language switch.
export function switchLocale(pathname: string, target: Locale) {
  return localePath(target, stripLocale(pathname));
}
