import { apiAuthFetch } from "@/lib/fetch-api";
import type { UserSetting } from "../types/users-api-type";
import type { UserSettingsForm } from "../validation/settings-schema";

export type UpdateSettingsPayload = UserSettingsForm;

export async function updateUserSettings(
  payload: UpdateSettingsPayload,
): Promise<UserSetting> {
  const response = await apiAuthFetch<UserSetting>({
    api: "users",
    url: "settings",
    options: {
      method: "PUT",
      body: payload,
    },
  });
  return response.data ?? payload;
}
