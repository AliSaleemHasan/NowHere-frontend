import { getLocales } from "expo-localization";

export type AppLocale = "en" | "de";

export function isAppLocale(value: string): value is AppLocale {
  return value === "en" || value === "de";
}

export function toAppLocale(value: string | null | undefined): AppLocale {
  const languageCode = value?.split(/[-_]/)[0]?.toLowerCase();
  return languageCode === "de" ? "de" : "en";
}

export function getDeviceLocale(): AppLocale {
  return toAppLocale(getLocales()[0]?.languageCode);
}
