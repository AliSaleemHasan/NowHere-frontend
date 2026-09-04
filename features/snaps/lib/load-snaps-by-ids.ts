import { isApiError } from "@/lib/http/api-error";
import { fetchSnapById } from "../api/useSnap";
import type { FindSnapResponse, Snap } from "../types/snaps-api-type";

export async function loadSnapsByIds(
  ids: string[],
  fetchSnap: (id: string) => Promise<FindSnapResponse> = fetchSnapById,
): Promise<Snap[]> {
  const unique = [...new Set(ids.filter((id) => id.length > 0))];
  const results = await Promise.all(
    unique.map(async (id) => {
      try {
        const payload = await fetchSnap(id);
        return payload.snap;
      } catch (error) {
        if (isApiError(error) && error.statusCode === 404) {
          return null;
        }
        throw error;
      }
    }),
  );
  return results.filter((item): item is Snap => item !== null);
}
