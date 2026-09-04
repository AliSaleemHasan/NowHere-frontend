import { i18n } from "@/lib/i18n";

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export type RelativeTimeStyle = "long" | "short";

function dateLocale(): string {
  return i18n.language?.startsWith("de") ? "de-DE" : "en-US";
}

export function formatRelativeTime(
  iso?: string,
  now = Date.now(),
  style: RelativeTimeStyle = "long",
): string | null {
  if (!iso) return null;
  const then = Date.parse(iso);
  if (!Number.isFinite(then)) return null;

  const diff = Math.max(0, now - then);

  if (diff < 45 * 1000) {
    return style === "short" ? i18n.t("time.now") : i18n.t("time.justNow");
  }

  if (diff < HOUR_MS) {
    const minutes = Math.max(1, Math.round(diff / MINUTE_MS));
    return style === "short"
      ? i18n.t("time.minutesAgoShort", { count: minutes })
      : i18n.t("time.minutesAgo", { count: minutes });
  }

  if (diff < DAY_MS) {
    const hours = Math.max(1, Math.round(diff / HOUR_MS));
    return style === "short"
      ? i18n.t("time.hoursAgoShort", { count: hours })
      : i18n.t("time.hoursAgo", { count: hours });
  }

  if (diff < 7 * DAY_MS) {
    const days = Math.max(1, Math.round(diff / DAY_MS));
    return style === "short"
      ? i18n.t("time.daysAgoShort", { count: days })
      : i18n.t("time.daysAgo", { count: days });
  }

  const date = new Date(then);
  const sameYear = date.getFullYear() === new Date(now).getFullYear();
  return date.toLocaleDateString(dateLocale(), {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}
