import { apiAuthFetch } from "@/lib/fetch-api";
import { ApiError } from "@/lib/http/api-error";
import {
  MAX_RESOLUTION_NOTE,
  normalizeSnap,
  type Snap,
} from "../types/snaps-api-type";

async function postResolution(
  id: string,
  path: "found" | "reopen",
  body?: { note?: string },
): Promise<Snap> {
  if (!id) {
    throw new ApiError("Snap id is required", 400);
  }
  const response = await apiAuthFetch<unknown>({
    api: "snaps",
    url: `${id}/${path}`,
    options: { method: "POST", body },
  });
  const snap = normalizeSnap(response.data);
  if (!snap) {
    throw new ApiError("Snap payload was invalid.", 500);
  }
  return snap;
}

export async function markSnapFound(
  id: string,
  note?: string,
): Promise<Snap> {
  const trimmed = typeof note === "string" ? note.trim() : "";
  const body = trimmed
    ? { note: trimmed.slice(0, MAX_RESOLUTION_NOTE) }
    : undefined;
  return postResolution(id, "found", body);
}

export async function reopenSnap(id: string): Promise<Snap> {
  return postResolution(id, "reopen");
}
