import { ApiError } from "@/lib/http/api-error";
import { Tags } from "@/utils";

const mockApiAuthFetch = jest.fn();

jest.mock("@/lib/fetch-api", () => ({
  apiAuthFetch: (...args: unknown[]) => mockApiAuthFetch(...args),
}));

import { deleteSnap } from "../delete-snap";
import { fetchMySnaps } from "../useMySnaps";

const sampleSnap = {
  id: "snap-1",
  _userId: "u1",
  description: "Coffee",
  snaps: ["snaps/a.jpg"],
  location: { type: "Point", coordinates: [13.4, 52.5] },
  tag: Tags.SOCIAL,
};

describe("fetchMySnaps", () => {
  beforeEach(() => {
    mockApiAuthFetch.mockReset();
  });

  it("requests GET /snaps/me including expired", async () => {
    mockApiAuthFetch.mockResolvedValueOnce({
      success: true,
      data: [sampleSnap, { id: "bad" }],
    });

    const result = await fetchMySnaps();

    expect(mockApiAuthFetch).toHaveBeenCalledWith({
      api: "snaps",
      url: "me?includeExpired=1",
      options: { method: "GET" },
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("snap-1");
  });
});

describe("deleteSnap", () => {
  beforeEach(() => {
    mockApiAuthFetch.mockReset();
  });

  it("sends DELETE /snaps/:id", async () => {
    mockApiAuthFetch.mockResolvedValueOnce({ success: true, data: null });

    await deleteSnap("snap-1");

    expect(mockApiAuthFetch).toHaveBeenCalledWith({
      api: "snaps",
      url: "snap-1",
      options: { method: "DELETE" },
    });
  });

  it("rejects an empty id without calling the API", async () => {
    await expect(deleteSnap("")).rejects.toBeInstanceOf(ApiError);
    expect(mockApiAuthFetch).not.toHaveBeenCalled();
  });
});
