import { apiAuthFetch } from "@/lib/fetch-api";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { normalizeSnap, type Snap } from "../types/snaps-api-type";
import { snapQueryKeys } from "./snap-query";

export async function fetchMySnaps(): Promise<Snap[]> {
  const response = await apiAuthFetch<unknown>({
    api: "snaps",
    url: "me?includeExpired=1",
    options: { method: "GET" },
  });
  const raw = Array.isArray(response.data) ? response.data : [];
  return raw
    .map((item) => normalizeSnap(item))
    .filter((item): item is Snap => item !== undefined);
}

export function useMySnaps() {
  const isFocused = useIsFocused();
  return useQuery({
    queryKey: snapQueryKeys.mine,
    throwOnError: false,
    queryFn: fetchMySnaps,
    refetchOnWindowFocus: true,
    enabled: isFocused,
  });
}
