import { locales } from "@/i18n/config";
export { default, alt, size, contentType } from "./opengraph-image";
export const dynamic = "force-static";
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}
