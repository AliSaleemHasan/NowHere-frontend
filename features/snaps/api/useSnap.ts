import { apiAuthFetch } from "@/lib/fetch-api";
import { useQuery } from "@tanstack/react-query";
import { FindSnapResponse } from "../types/snaps-api-type";
import { snapQueryKeys } from "./snap-query";

export function useSnapById(id: string) {
  return useQuery({
    queryKey: snapQueryKeys.detail(id),
    throwOnError: false,
    queryFn: async () => {
      const response = await apiAuthFetch<FindSnapResponse>({
        url: id,
        options: { method: "GET" },
      });
      if (!response.data?.snap || !Array.isArray(response.data.imageKeys)) {
        throw new Error("Snap payload was missing image URLs.");
      }
      return response.data;
    },
    enabled: !!id,
  });
}
