import { z } from "zod";
import {
  MAX_DISTANCE_PRESETS,
  NEW_SNAP_DISTANCE_PRESETS,
  SNAP_DISAPPEAR_TIME_PRESETS,
} from "../settings-presets";

export const userSettingsSchema = z.object({
  maxDistance: z.literal(MAX_DISTANCE_PRESETS, "users.settings.invalidPreset"),
  newSnapDistance: z.literal(
    NEW_SNAP_DISTANCE_PRESETS,
    "users.settings.invalidPreset",
  ),
  snapDisappearTime: z.literal(
    SNAP_DISAPPEAR_TIME_PRESETS,
    "users.settings.invalidPreset",
  ),
});

export type UserSettingsForm = z.infer<typeof userSettingsSchema>;
