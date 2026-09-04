import { Tags } from "@/utils";
import { ApiError } from "@/lib/http/api-error";

const mockApiAuthFetch = jest.fn();

jest.mock("@/lib/fetch-api", () => ({
  apiAuthFetch: (...args: unknown[]) => mockApiAuthFetch(...args),
}));

import { markSnapFound, reopenSnap } from "../snap-resolution";

const foundSnap = {
  id: "snap-1",
  _userId: "u1",
  description: "Keys",
  snaps: ["snaps/a.jpg"],
  location: { type: "Point", coordinates: [13.4, 52.5] },
  tag: Tags.LOST,
  resolution: "FOUND",
  resolutionNote: "under the bench",
};

describe("snap resolution API", () => {
  beforeEach(() => {
    mockApiAuthFetch.mockReset();
  });

  it("POSTs /snaps/:id/found with an optional note", async () => {
    mockApiAuthFetch.mockResolvedValueOnce({ success: true, data: foundSnap });

    const result = await markSnapFound("snap-1", "  under the bench  ");

    expect(mockApiAuthFetch).toHaveBeenCalledWith({
      api: "snaps",
      url: "snap-1/found",
      options: {
        method: "POST",
        body: { note: "under the bench" },
      },
    });
    expect(result.resolution).toBe("FOUND");
    expect(result.resolutionNote).toBe("under the bench");
  });

  it("omits the body when the note is empty", async () => {
    mockApiAuthFetch.mockResolvedValueOnce({ success: true, data: foundSnap });

    await markSnapFound("snap-1", "   ");

    expect(mockApiAuthFetch).toHaveBeenCalledWith({
      api: "snaps",
      url: "snap-1/found",
      options: { method: "POST", body: undefined },
    });
  });

  it("POSTs /snaps/:id/reopen", async () => {
    mockApiAuthFetch.mockResolvedValueOnce({
      success: true,
      data: { ...foundSnap, resolution: "OPEN", resolutionNote: "" },
    });

    const result = await reopenSnap("snap-1");

    expect(mockApiAuthFetch).toHaveBeenCalledWith({
      api: "snaps",
      url: "snap-1/reopen",
      options: { method: "POST", body: undefined },
    });
    expect(result.resolution).toBe("OPEN");
  });

  it("rejects an empty id", async () => {
    await expect(markSnapFound("")).rejects.toBeInstanceOf(ApiError);
    await expect(reopenSnap("")).rejects.toBeInstanceOf(ApiError);
    expect(mockApiAuthFetch).not.toHaveBeenCalled();
  });
});
