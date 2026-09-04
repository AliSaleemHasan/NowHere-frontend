import { apiAuthFetch } from "@/lib/fetch-api";
import { ApiError } from "@/lib/http/api-error";

export async function deleteSnap(id: string): Promise<void> {
  if (!id) {
    throw new ApiError("Snap id is required", 400);
  }
  await apiAuthFetch({
    api: "snaps",
    url: id,
    options: { method: "DELETE" },
  });
}
