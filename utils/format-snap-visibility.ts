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
  if (remaining <= 0) return "No longer in your nearby window";

  if (remaining < HOUR_MS) return "Visible for less than an hour";

  if (remaining < DAY_MS) {
    const hours = Math.max(1, Math.round(remaining / HOUR_MS));
    return hours === 1
      ? "Visible for about 1 hour"
      : `Visible for about ${hours} hours`;
  }

  const days = Math.max(1, Math.round(remaining / DAY_MS));
  return days === 1
    ? "Visible for about 1 day"
    : `Visible for about ${days} days`;
}
