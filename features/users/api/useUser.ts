import { apiAuthFetch } from "@/lib/fetch-api";
import { UserResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export function useUser(userId?: string) {
  return useQuery({
    queryKey: ["user", userId],
    throwOnError: true,
    queryFn: () =>
      apiAuthFetch<UserResponse>({
        api: "users",
        url: `id/${userId}`,
        options: { method: "GET" },
      }),
    enabled: !!userId,
  });
}
