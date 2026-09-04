import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import { getDeviceLocale } from "./device-locale";
import { readLocaleOverride } from "./locale-storage";
import { resources } from "./resources";

export const i18n = createInstance();

void i18n.use(initReactI18next).init({
  resources,
  lng: readLocaleOverride() ?? getDeviceLocale(),
  fallbackLng: "en",
  supportedLngs: ["en", "de"],
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
  initAsync: false,
});
