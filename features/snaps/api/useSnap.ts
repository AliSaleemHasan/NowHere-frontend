import { apiAuthFetch } from "@/lib/fetch-api";
import { useQuery } from "@tanstack/react-query";
import { FindSnapResponse } from "../types/snaps-api-type";

export function useSnap(id: string) {
  return useQuery({
    queryKey: ["snap", id],
    queryFn: () =>
      apiAuthFetch<FindSnapResponse>({
        url: `snaps/${id}`,
        options: { method: "GET" },
      }),
    enabled: !!id,
  });
}
