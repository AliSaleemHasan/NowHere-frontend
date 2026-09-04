import { apiAuthFetch } from "@/lib/fetch-api";

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export async function changePassword(
  payload: ChangePasswordPayload,
): Promise<void> {
  await apiAuthFetch<unknown>({
    api: "users",
    url: "me/password",
    options: {
      method: "POST",
      body: payload,
    },
  });
}
