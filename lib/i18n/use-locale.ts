import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toAppLocale, type AppLocale } from "./device-locale";
import { persistLocale } from "./locale-storage";

export function useLocale() {
  const { i18n } = useTranslation();

  const setLocale = useCallback(
    (locale: AppLocale) => {
      persistLocale(locale);
      void i18n.changeLanguage(locale);
    },
    [i18n],
  );

  return {
    locale: toAppLocale(i18n.resolvedLanguage ?? i18n.language),
    setLocale,
  };
}
