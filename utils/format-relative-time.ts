const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export type RelativeTimeStyle = "long" | "short";

function plural(count: number, noun: string): string {
  return count === 1 ? `1 ${noun}` : `${count} ${noun}s`;
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
    return style === "short" ? "Now" : "Just now";
  }

  if (diff < HOUR_MS) {
    const minutes = Math.max(1, Math.round(diff / MINUTE_MS));
    return style === "short" ? `${minutes}m ago` : `${plural(minutes, "minute")} ago`;
  }

  if (diff < DAY_MS) {
    const hours = Math.max(1, Math.round(diff / HOUR_MS));
    return style === "short" ? `${hours}h ago` : `${plural(hours, "hour")} ago`;
  }

  if (diff < 7 * DAY_MS) {
    const days = Math.max(1, Math.round(diff / DAY_MS));
    return style === "short" ? `${days}d ago` : `${plural(days, "day")} ago`;
  }

  const date = new Date(then);
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  const sameYear = year === new Date(now).getFullYear();
  return sameYear ? `${month} ${day}` : `${month} ${day}, ${year}`;
}
