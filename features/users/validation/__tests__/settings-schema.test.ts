import {
  MAX_DISTANCE_PRESETS,
  NEW_SNAP_DISTANCE_PRESETS,
  SNAP_DISAPPEAR_TIME_PRESETS,
} from "../../settings-presets";
import { userSettingsSchema } from "../settings-schema";

const validBase = {
  maxDistance: 1000,
  newSnapDistance: 250,
  snapDisappearTime: 1,
} as const;

describe("userSettingsSchema", () => {
  it.each(MAX_DISTANCE_PRESETS)("allows maxDistance %s", (maxDistance) => {
    expect(
      userSettingsSchema.safeParse({ ...validBase, maxDistance }).success,
    ).toBe(true);
  });

  it.each(NEW_SNAP_DISTANCE_PRESETS)(
    "allows newSnapDistance %s",
    (newSnapDistance) => {
      expect(
        userSettingsSchema.safeParse({ ...validBase, newSnapDistance }).success,
      ).toBe(true);
    },
  );

  it.each(SNAP_DISAPPEAR_TIME_PRESETS)(
    "allows snapDisappearTime %s",
    (snapDisappearTime) => {
      expect(
        userSettingsSchema.safeParse({ ...validBase, snapDisappearTime })
          .success,
      ).toBe(true);
    },
  );

  it("rejects maxDistance values outside the preset enum", () => {
    for (const maxDistance of [0, 999, 1001, 2000, 25001]) {
      const result = userSettingsSchema.safeParse({
        ...validBase,
        maxDistance,
      });
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error.issues.map((issue) => issue.message)).toContain(
        "users.settings.invalidPreset",
      );
    }
  });

  it("rejects newSnapDistance values outside the preset enum", () => {
    for (const newSnapDistance of [0, 100, 300, 5000, 10000]) {
      expect(
        userSettingsSchema.safeParse({ ...validBase, newSnapDistance }).success,
      ).toBe(false);
    }
  });

  it("rejects snapDisappearTime values outside the preset enum", () => {
    for (const snapDisappearTime of [0, 2, 5, 8, 14]) {
      expect(
        userSettingsSchema.safeParse({ ...validBase, snapDisappearTime })
          .success,
      ).toBe(false);
    }
  });
});
