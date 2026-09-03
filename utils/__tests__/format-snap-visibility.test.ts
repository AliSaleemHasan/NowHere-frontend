import { formatRemainingVisibility } from "../format-snap-visibility";

const NOW = Date.parse("2026-09-03T12:00:00.000Z");
const CREATED = "2026-09-03T00:00:00.000Z";

describe("formatRemainingVisibility", () => {
  it("returns null without a timestamp or lifetime", () => {
    expect(formatRemainingVisibility(undefined, 1, NOW)).toBeNull();
    expect(formatRemainingVisibility(CREATED, undefined, NOW)).toBeNull();
    expect(formatRemainingVisibility(CREATED, 0, NOW)).toBeNull();
  });

  it("describes remaining hours and days from the viewer lifetime", () => {
    expect(formatRemainingVisibility(CREATED, 1, NOW)).toBe(
      "Visible for about 12 hours",
    );
    expect(formatRemainingVisibility(CREATED, 3, NOW)).toBe(
      "Visible for about 3 days",
    );
  });

  it("flags snaps that are outside the nearby window", () => {
    expect(
      formatRemainingVisibility("2026-08-01T00:00:00.000Z", 1, NOW),
    ).toBe("No longer in your nearby window");
  });
});
