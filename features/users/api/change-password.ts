import { apiAuthFetch } from "@/lib/fetch-api";

export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  await apiAuthFetch<unknown>({
    api: "users",
    url: "me/password",
    options: {
      method: "POST",
      body: payload,
    },
  });
}
