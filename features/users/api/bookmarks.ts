import { apiAuthFetch } from "@/lib/fetch-api";
import { ApiError } from "@/lib/http/api-error";
import { isRecord } from "@/lib/http/is-record";
import type { SnapBookmark } from "../types/bookmark-api-type";

function normalizeBookmark(input: unknown): SnapBookmark | undefined {
  if (!isRecord(input)) return undefined;
  const snapId = typeof input.snapId === "string" ? input.snapId : "";
  if (!snapId) return undefined;
  return {
    userId: typeof input.userId === "string" ? input.userId : "",
    snapId,
    createdAt:
      typeof input.createdAt === "string" ? input.createdAt : undefined,
  };
}

export function normalizeBookmarkList(data: unknown): SnapBookmark[] {
  const raw = Array.isArray(data)
    ? data
    : isRecord(data) && Array.isArray(data.bookmarks)
      ? data.bookmarks
      : [];
  return raw
    .map(normalizeBookmark)
    .filter((item): item is SnapBookmark => item !== undefined);
}

export async function listBookmarks(): Promise<SnapBookmark[]> {
  const response = await apiAuthFetch<unknown>({
    api: "users",
    url: "me/bookmarks",
    options: { method: "GET" },
  });
  return normalizeBookmarkList(response.data);
}

export async function addBookmark(snapId: string): Promise<SnapBookmark> {
  if (!snapId) {
    throw new ApiError("Snap id is required", 400);
  }
  const response = await apiAuthFetch<unknown>({
    api: "users",
    url: `me/bookmarks/${snapId}`,
    options: { method: "PUT" },
  });
  return normalizeBookmark(response.data) ?? { userId: "", snapId };
}

export async function removeBookmark(snapId: string): Promise<void> {
  if (!snapId) {
    throw new ApiError("Snap id is required", 400);
  }
  await apiAuthFetch({
    api: "users",
    url: `me/bookmarks/${snapId}`,
    options: { method: "DELETE" },
  });
}
