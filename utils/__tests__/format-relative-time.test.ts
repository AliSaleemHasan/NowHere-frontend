import { i18n } from "@/lib/i18n";
import { formatRelativeTime } from "../format-relative-time";

const NOW = Date.parse("2026-09-03T12:00:00.000Z");

describe("formatRelativeTime", () => {
  it("returns null for missing or invalid timestamps", () => {
    expect(formatRelativeTime(undefined, NOW)).toBeNull();
    expect(formatRelativeTime("not-a-date", NOW)).toBeNull();
  });

  it("uses just-now copy for very recent posts", () => {
    expect(formatRelativeTime("2026-09-03T11:59:40.000Z", NOW, "long")).toBe(
      "Just now",
    );
    expect(formatRelativeTime("2026-09-03T11:59:40.000Z", NOW, "short")).toBe(
      "Now",
    );
  });

  it("formats minutes, hours, and days", () => {
    expect(formatRelativeTime("2026-09-03T11:48:00.000Z", NOW, "long")).toBe(
      "12 minutes ago",
    );
    expect(formatRelativeTime("2026-09-03T11:48:00.000Z", NOW, "short")).toBe(
      "12m ago",
    );
    expect(formatRelativeTime("2026-09-03T10:00:00.000Z", NOW, "long")).toBe(
      "2 hours ago",
    );
    expect(formatRelativeTime("2026-09-03T10:00:00.000Z", NOW, "short")).toBe(
      "2h ago",
    );
    expect(formatRelativeTime("2026-09-01T12:00:00.000Z", NOW, "long")).toBe(
      "2 days ago",
    );
    expect(formatRelativeTime("2026-09-01T12:00:00.000Z", NOW, "short")).toBe(
      "2d ago",
    );
  });

  it("singularizes one unit", () => {
    expect(formatRelativeTime("2026-09-03T11:00:00.000Z", NOW, "long")).toBe(
      "1 hour ago",
    );
    expect(formatRelativeTime("2026-09-02T12:00:00.000Z", NOW, "long")).toBe(
      "1 day ago",
    );
  });

  it("uses German copy after a locale change", async () => {
    await i18n.changeLanguage("de");
    expect(formatRelativeTime("2026-09-03T11:59:40.000Z", NOW, "long")).toBe(
      "Gerade eben",
    );
    expect(formatRelativeTime("2026-09-03T11:48:00.000Z", NOW, "long")).toBe(
      "vor 12 Minuten",
    );
  });
});
