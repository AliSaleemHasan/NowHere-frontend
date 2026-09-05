import { ApiError } from "@/lib/http/api-error";

const mockApiAuthFetch = jest.fn();

jest.mock("@/lib/fetch-api", () => ({
  apiAuthFetch: (...args: unknown[]) => mockApiAuthFetch(...args),
}));

import { updateUserImage } from "../updateUserImage";

describe("updateUserImage", () => {
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

  it("presigns a profile upload, PUTs the file, then attaches the key", async () => {
    mockApiAuthFetch
      .mockResolvedValueOnce({
        success: true,
        data: {
          uploads: [
            {
              uploadUrl: "https://s3.example/profile",
              key: "profile/u1/photo.jpg",
            },
          ],
        },
      })
      .mockResolvedValueOnce({
        success: true,
        data: {
          user: { id: "u1", image: "profile/u1/photo.jpg" },
          userImage: "https://cdn.example/profile.jpg",
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

    const result = await updateUserImage("file:///tmp/profile.jpg");

    expect(mockApiAuthFetch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        api: "storage",
        url: "presigned-upload",
      }),
    );
    const presignBody = mockApiAuthFetch.mock.calls[0][0].options.body;
    expect(presignBody.prefix).toBe("profile");
    expect(presignBody.files).toEqual([
      { filename: "profile.jpg", contentType: "image/jpeg" },
    ]);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://s3.example/profile",
      expect.objectContaining({
        method: "PUT",
        headers: { "Content-Type": "image/jpeg" },
      }),
    );

    expect(mockApiAuthFetch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        api: "users",
        url: "image",
        options: expect.objectContaining({
          method: "PUT",
          body: { key: "profile/u1/photo.jpg" },
        }),
      }),
    );
    expect(result.userImage).toBe("https://cdn.example/profile.jpg");
  });

  it("rejects an empty user payload after upload", async () => {
    mockApiAuthFetch
      .mockResolvedValueOnce({
        success: true,
        data: {
          uploads: [
            { uploadUrl: "https://s3.example/profile", key: "profile/u1/a.jpg" },
          ],
        },
      })
      .mockResolvedValueOnce({ success: true, data: {} });

    class MockXHR {
      status = 200;
      response = new Blob(["file"]);
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

    await expect(updateUserImage("file:///tmp/a.jpg")).rejects.toBeInstanceOf(
      ApiError,
    );
  });
});
