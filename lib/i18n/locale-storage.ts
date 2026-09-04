import { mmkvInstance } from "@/lib/storage";
import { isAppLocale, type AppLocale } from "./device-locale";

export const LOCALE_OVERRIDE_KEY = "i18n.locale";

export function readLocaleOverride(): AppLocale | null {
  const value = mmkvInstance.getString(LOCALE_OVERRIDE_KEY);
  if (value && isAppLocale(value)) return value;
  return null;
}

export function persistLocale(locale: AppLocale): void {
  mmkvInstance.set(LOCALE_OVERRIDE_KEY, locale);
}
