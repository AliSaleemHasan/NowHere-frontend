import { apiAuthFetch } from "@/lib/fetch-api";
import type { GetUserResponse, UserProfile } from "@/types/api";
import type { UpdateProfileForm } from "../validation/profile-schema";

export type UpdateProfilePayload = UpdateProfileForm;

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<GetUserResponse | UserProfile | undefined> {
  const response = await apiAuthFetch<GetUserResponse | UserProfile>({
    api: "users",
    url: "me",
    options: {
      method: "PATCH",
      body: payload,
    },
  });
  return response.data;
}
