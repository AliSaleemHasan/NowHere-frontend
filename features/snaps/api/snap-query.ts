import type { ApiResponse } from "@/types/api";
import type { QueryClient } from "@tanstack/react-query";
import {
  getSnapId,
  normalizeSnap,
  type CreateSnapResponse,
} from "../types/snaps-api-type";

export const snapQueryKeys = {
  all: ["snaps"] as const,
  near: ["snaps", "near"] as const,
  nearList: (
    showSeen: boolean,
    lng: number,
    lat: number,
    tagsParam: string,
  ) => ["snaps", "near", showSeen, lng, lat, tagsParam] as const,
  mine: ["snaps", "me"] as const,
  detail: (id: string) => ["snap", id] as const,
};

export function evictSnapFromCache(
  queryClient: QueryClient,
  snapId: string,
  options: { mine?: boolean } = {},
): void {
  queryClient.setQueriesData<ApiResponse<CreateSnapResponse[]>>(
    { queryKey: snapQueryKeys.near },
    (old) => {
      if (!old?.data) return old;
      return {
        success: true,
        data: old.data.filter((item) => getSnapId(item) !== snapId),
      };
    },
  );

  if (options.mine) {
    queryClient.setQueriesData<CreateSnapResponse[]>(
      { queryKey: snapQueryKeys.mine },
      (old) =>
        Array.isArray(old)
          ? old.filter((item) => getSnapId(item) !== snapId)
          : old,
    );
    queryClient.removeQueries({ queryKey: snapQueryKeys.detail(snapId) });
  }
}

export function invalidateSnapQueries(queryClient: QueryClient): void {
  void queryClient.invalidateQueries({ queryKey: snapQueryKeys.all });
}

export function upsertNearSnap(
  queryClient: QueryClient,
  created: unknown,
): void {
  const snap = normalizeSnap(created);
  if (!snap) return;

  queryClient.setQueriesData<ApiResponse<CreateSnapResponse[]>>(
    { queryKey: snapQueryKeys.near },
    (old) => {
      const existing = old?.data ?? [];
      if (existing.some((item) => getSnapId(item) === snap.id)) {
        return old ?? { success: true, data: existing };
      }
      return { success: true, data: [...existing, snap] };
    },
  );
}
