import type { Locale } from "../config";
import { en, type UiDictionary } from "./en";
import { pt } from "./pt";

const dictionaries: Record<Locale, UiDictionary> = { en, pt };
export const ui = (locale: Locale) => dictionaries[locale];
export type { UiDictionary };
