import { apiFetch } from "@/lib/fetch-api";
import { UserResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export function useUser(userId?: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      apiFetch<UserResponse>({
        url: `users/id/${userId}`,
        options: { method: "GET" },
      }),
    enabled: !!userId,
  });
}
