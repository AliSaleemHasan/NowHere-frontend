import { apiAuthFetch } from "@/lib/fetch-api";
import type { UserProfile } from "@/types/api";
import type { UpdateProfileForm } from "../validation/profile-schema";

export async function updateProfile(
  payload: UpdateProfileForm,
): Promise<UserProfile | undefined> {
  const response = await apiAuthFetch<UserProfile>({
    api: "users",
    url: "me",
    options: {
      method: "PATCH",
      body: payload,
    },
  });
  return response.data;
}
