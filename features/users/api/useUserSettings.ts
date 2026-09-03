import { apiAuthFetch } from "@/lib/fetch-api";
import { retryAfterSignupProfile, retryDelayBackoff } from "@/lib/query-retry";
import { useQuery } from "@tanstack/react-query";
import { UserSetting } from "../types/users-api-type";
import { userQueryKeys } from "./user-query";

export function useUserSettings() {
  return useQuery({
    queryKey: userQueryKeys.settings,
    throwOnError: false,
    queryFn: async () => {
      const response = await apiAuthFetch<UserSetting>({
        api: "users",
        url: "settings",
        options: {
          method: "GET",
        },
      });
      return response.data;
    },
    retry: retryAfterSignupProfile,
    retryDelay: retryDelayBackoff,
  });
}
