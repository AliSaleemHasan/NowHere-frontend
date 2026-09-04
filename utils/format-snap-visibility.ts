import { i18n } from "@/lib/i18n";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export function formatRemainingVisibility(
  createdAt: string | undefined,
  lifetimeDays: number | undefined,
  now = Date.now(),
): string | null {
  if (!createdAt || lifetimeDays == null || lifetimeDays <= 0) return null;
  const created = Date.parse(createdAt);
  if (!Number.isFinite(created)) return null;

  const remaining = created + lifetimeDays * DAY_MS - now;
  if (remaining <= 0) return i18n.t("snaps.visibility.expired");

  if (remaining < HOUR_MS) return i18n.t("snaps.visibility.lessThanHour");

  if (remaining < DAY_MS) {
    const hours = Math.max(1, Math.round(remaining / HOUR_MS));
    return i18n.t("snaps.visibility.hours", { count: hours });
  }

  const days = Math.max(1, Math.round(remaining / DAY_MS));
  return i18n.t("snaps.visibility.days", { count: days });
}
