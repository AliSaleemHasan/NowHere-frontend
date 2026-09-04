import { apiAuthFetch } from "@/lib/fetch-api";
import type { UserSetting } from "../types/users-api-type";
import type { UserSettingsForm } from "../validation/settings-schema";

export async function updateUserSettings(
  payload: UserSettingsForm,
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
