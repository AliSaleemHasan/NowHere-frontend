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
  detail: (id: string) => ["snap", id] as const,
};

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
