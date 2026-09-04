import { Tags } from "@/utils";
import { ApiError } from "@/lib/http/api-error";

const mockApiAuthFetch = jest.fn();

jest.mock("@/lib/fetch-api", () => ({
  apiAuthFetch: (...args: unknown[]) => mockApiAuthFetch(...args),
}));

import { createSnapWithDirectUpload } from "../post-new-snap";

describe("createSnapWithDirectUpload", () => {
  const originalFetch = global.fetch;
  const originalXHR = global.XMLHttpRequest;

  beforeEach(() => {
    mockApiAuthFetch.mockReset();
    global.fetch = jest.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
    global.XMLHttpRequest = originalXHR;
  });

  it("rejects a missing or invalid location", async () => {
    await expect(
      createSnapWithDirectUpload({
        description: "Hi",
        tag: Tags.SOCIAL,
        location: { type: "Point", coordinates: [0, 0] },
        snaps: ["file:///tmp/a.jpg"],
      }),
    ).rejects.toBeInstanceOf(ApiError);
    expect(mockApiAuthFetch).not.toHaveBeenCalled();
  });

  it("rejects an empty photo list", async () => {
    await expect(
      createSnapWithDirectUpload({
        description: "Hi",
        tag: Tags.SOCIAL,
        location: { type: "Point", coordinates: [13.4, 52.5] },
        snaps: ["", ""],
      }),
    ).rejects.toBeInstanceOf(ApiError);
    expect(mockApiAuthFetch).not.toHaveBeenCalled();
  });

  it("presigns, PUTs files, then posts storage keys", async () => {
    mockApiAuthFetch
      .mockResolvedValueOnce({
        success: true,
        data: {
          uploads: [
            { uploadUrl: "https://s3.example/1", key: "snaps/2026-09-03/u/a.jpg" },
            { uploadUrl: "https://s3.example/2", key: "snaps/2026-09-03/u/b.png" },
          ],
        },
      })
      .mockResolvedValueOnce({
        success: true,
        data: {
          id: "snap-1",
          _userId: "u",
          description: "Coffee",
          snaps: ["snaps/2026-09-03/u/a.jpg", "snaps/2026-09-03/u/b.png"],
          location: { type: "Point", coordinates: [13.4, 52.5] },
          tag: Tags.SOCIAL,
          status: "SUCCESS",
        },
      });

    class MockXHR {
      status = 200;
      response = new Blob(["file"]);
      responseType = "";
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      open = jest.fn();
      send = jest.fn(() => {
        this.onload?.();
      });
    }
    global.XMLHttpRequest = jest.fn(
      () => new MockXHR(),
    ) as unknown as typeof XMLHttpRequest;

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => "",
    });

    const result = await createSnapWithDirectUpload({
      description: "Coffee",
      tag: Tags.SOCIAL,
      location: { type: "Point", coordinates: [13.4, 52.5] },
      snaps: ["file:///tmp/a.jpg", "file:///tmp/b.png"],
    });

    expect(mockApiAuthFetch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        api: "storage",
        url: "presigned-upload",
      }),
    );
    const presignBody = mockApiAuthFetch.mock.calls[0][0].options.body;
    expect(presignBody.prefix).toBe("snaps");
    expect(presignBody.files).toEqual([
      { filename: "a.jpg", contentType: "image/jpeg" },
      { filename: "b.png", contentType: "image/png" },
    ]);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://s3.example/1",
      expect.objectContaining({
        method: "PUT",
        headers: { "Content-Type": "image/jpeg" },
      }),
    );

    const createBody = mockApiAuthFetch.mock.calls[1][0].options.body;
    expect(createBody.snaps).toEqual([
      "snaps/2026-09-03/u/a.jpg",
      "snaps/2026-09-03/u/b.png",
    ]);
    expect(createBody.location.coordinates).toEqual([13.4, 52.5]);
    expect(result.id).toBe("snap-1");
  });
});
