import { apiAuthFetch } from "@/lib/fetch-api";
import { ApiError } from "@/lib/http/api-error";
import { useQuery } from "@tanstack/react-query";
import {
  FindSnapResponse,
  normalizeSnap,
} from "../types/snaps-api-type";
import { snapQueryKeys } from "./snap-query";

export async function fetchSnapById(id: string): Promise<FindSnapResponse> {
  if (!id) {
    throw new ApiError("Snap id is required", 400);
  }
  const response = await apiAuthFetch<FindSnapResponse>({
    url: id,
    options: { method: "GET" },
  });
  const snap = normalizeSnap(response.data?.snap);
  if (!snap) {
    throw new ApiError("Snap payload was missing.", 500);
  }
  return {
    snap,
    imageKeys: Array.isArray(response.data?.imageKeys)
      ? response.data.imageKeys
      : [],
  };
}

export function useSnapById(id: string) {
  return useQuery({
    queryKey: snapQueryKeys.detail(id),
    throwOnError: false,
    queryFn: () => fetchSnapById(id),
    enabled: !!id,
  });
}
