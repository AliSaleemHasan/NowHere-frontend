import { apiAuthFetch } from "@/lib/fetch-api";
import { retryAfterSignupProfile, retryDelayBackoff } from "@/lib/query-retry";
import { GetUserResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { userQueryKeys } from "./user-query";

export function useUser(userId?: string) {
  return useQuery({
    queryKey: userQueryKeys.detail(userId),
    throwOnError: false,
    queryFn: async () => {
      const response = await apiAuthFetch<GetUserResponse>({
        api: "users",
        url: `id/${userId}`,
        options: { method: "GET" },
      });
      return response.data;
    },
    enabled: !!userId,
    retry: retryAfterSignupProfile,
    retryDelay: retryDelayBackoff,
  });
}
