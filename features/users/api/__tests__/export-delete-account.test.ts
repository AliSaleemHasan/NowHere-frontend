import { ApiError } from "@/lib/http/api-error";

const mockApiAuthFetch = jest.fn();

jest.mock("@/lib/fetch-api", () => ({
  apiAuthFetch: (...args: unknown[]) => mockApiAuthFetch(...args),
}));

import { deleteAccount } from "../delete-account";
import { exportAccount } from "../export-user";

describe("account export and delete API", () => {
  beforeEach(() => {
    mockApiAuthFetch.mockReset();
  });

  it("loads GET /users/me/export", async () => {
    const payload = {
      exportedAt: "2026-09-04T12:00:00.000Z",
      user: { id: "u1", email: "a@a.com" },
      settings: { maxDistance: 1000, newSnapDistance: 250, snapDisappearTime: 1 },
      snaps: [],
      seen: [],
      bookmarks: [],
      reports: [],
    };
    mockApiAuthFetch.mockResolvedValueOnce({ success: true, data: payload });

    await expect(exportAccount()).resolves.toEqual(payload);
    expect(mockApiAuthFetch).toHaveBeenCalledWith({
      api: "users",
      url: "me/export",
      options: { method: "GET" },
    });
  });

  it("rejects an empty export payload without an English message", async () => {
    mockApiAuthFetch.mockResolvedValueOnce({ success: true, data: undefined });
    const error = await exportAccount().catch((err: unknown) => err);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ message: "", statusCode: 500 });
  });

  it("sends DELETE /users/me with the password", async () => {
    mockApiAuthFetch.mockResolvedValueOnce({ success: true, data: { success: true } });

    await deleteAccount("Secret1!");

    expect(mockApiAuthFetch).toHaveBeenCalledWith({
      api: "users",
      url: "me",
      options: {
        method: "DELETE",
        body: { password: "Secret1!" },
      },
    });
  });
});
