import { Tags } from "@/utils";
import { ApiError } from "@/lib/http/api-error";
import type { FindSnapResponse, Snap } from "../../types/snaps-api-type";
import { loadSnapsByIds } from "../load-snaps-by-ids";

function snap(id: string): Snap {
  return {
    id,
    _userId: "u1",
    description: id,
    snaps: [],
    location: { type: "Point", coordinates: [13.4, 52.5] },
    tag: Tags.LOST,
    resolution: "OPEN",
  };
}

function payload(id: string): FindSnapResponse {
  return { snap: snap(id), imageKeys: [] };
}

describe("loadSnapsByIds", () => {
  it("skips bookmarks whose snap 404s", async () => {
    const fetchSnap = jest.fn(async (id: string) => {
      if (id === "gone") {
        throw new ApiError("not found", 404);
      }
      return payload(id);
    });

    const result = await loadSnapsByIds(["keep-a", "gone", "keep-b"], fetchSnap);

    expect(result.map((item) => item.id)).toEqual(["keep-a", "keep-b"]);
    expect(fetchSnap).toHaveBeenCalledTimes(3);
  });

  it("rethrows non-404 errors", async () => {
    const fetchSnap = jest.fn(async () => {
      throw new ApiError("server", 500);
    });

    await expect(loadSnapsByIds(["snap-1"], fetchSnap)).rejects.toBeInstanceOf(
      ApiError,
    );
  });
});
