import { apiAuthFetch } from "@/lib/fetch-api";

export async function deleteAccount(password: string): Promise<void> {
  await apiAuthFetch({
    api: "users",
    url: "me",
    options: {
      method: "DELETE",
      body: { password },
    },
  });
}
