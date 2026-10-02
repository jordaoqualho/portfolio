"use client";

import { createContext, useContext, type ReactNode } from "react";
import { defaultLocale, type Locale } from "./config";
import { ui } from "./ui";

const LocaleContext = createContext<Locale>(defaultLocale);

// Only the locale crosses the server/client boundary; client components read
// their strings from the dictionary module (some entries are functions).
export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => useContext(LocaleContext);
export const useUi = () => ui(useContext(LocaleContext));
