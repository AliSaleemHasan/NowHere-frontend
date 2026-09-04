import { act, renderHook } from "@testing-library/react-native";
import { getLocales } from "expo-localization";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { mmkvInstance } from "@/lib/storage";
import { getDeviceLocale } from "../device-locale";
import { i18n } from "../init";
import {
  LOCALE_OVERRIDE_KEY,
  persistLocale,
  readLocaleOverride,
} from "../locale-storage";
import { useLocale } from "../use-locale";

const mockGetLocales = getLocales as jest.MockedFunction<typeof getLocales>;

function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(I18nextProvider, { i18n }, children);
}

describe("locale", () => {
  beforeEach(async () => {
    mmkvInstance.remove(LOCALE_OVERRIDE_KEY);
    mockGetLocales.mockReset();
    mockGetLocales.mockReturnValue([
      { languageCode: "en", languageTag: "en-US" },
    ] as ReturnType<typeof getLocales>);
    await i18n.changeLanguage("en");
  });

  it("uses de when the device locale is de", () => {
    mockGetLocales.mockReturnValue([
      { languageCode: "de", languageTag: "de-DE" },
    ] as ReturnType<typeof getLocales>);

    expect(getDeviceLocale()).toBe("de");
  });

  it("falls back to en for unknown device locales", () => {
    mockGetLocales.mockReturnValue([
      { languageCode: "fr", languageTag: "fr-FR" },
    ] as ReturnType<typeof getLocales>);

    expect(getDeviceLocale()).toBe("en");
  });

  it("persists a locale override via setLocale", async () => {
    const { result } = renderHook(() => useLocale(), { wrapper });

    await act(async () => {
      result.current.setLocale("de");
    });

    expect(readLocaleOverride()).toBe("de");
    expect(result.current.locale).toBe("de");
    expect(i18n.language).toBe("de");
  });

  it("reads the persisted override from MMKV", () => {
    persistLocale("de");
    expect(readLocaleOverride()).toBe("de");
  });
});
