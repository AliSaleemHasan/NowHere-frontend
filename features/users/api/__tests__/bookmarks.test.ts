import { ApiError } from "@/lib/http/api-error";
import { isSnapBookmarked } from "../../types/bookmark-api-type";

const mockApiAuthFetch = jest.fn();

jest.mock("@/lib/fetch-api", () => ({
  apiAuthFetch: (...args: unknown[]) => mockApiAuthFetch(...args),
}));

import {
  addBookmark,
  listBookmarks,
  normalizeBookmarkList,
  removeBookmark,
} from "../bookmarks";

describe("bookmarks API", () => {
  beforeEach(() => {
    mockApiAuthFetch.mockReset();
  });

  it("lists bookmarks from GET /users/me/bookmarks", async () => {
    mockApiAuthFetch.mockResolvedValueOnce({
      success: true,
      data: {
        bookmarks: [
          { userId: "u1", snapId: "snap-1", createdAt: "2026-09-01T00:00:00.000Z" },
          { userId: "u1" },
        ],
      },
    });

    const result = await listBookmarks();

    expect(mockApiAuthFetch).toHaveBeenCalledWith({
      api: "users",
      url: "me/bookmarks",
      options: { method: "GET" },
    });
    expect(result).toEqual([
      {
        userId: "u1",
        snapId: "snap-1",
        createdAt: "2026-09-01T00:00:00.000Z",
      },
    ]);
  });

  it("saves with PUT /users/me/bookmarks/:snapId", async () => {
    mockApiAuthFetch.mockResolvedValueOnce({
      success: true,
      data: { userId: "u1", snapId: "snap-1" },
    });

    const result = await addBookmark("snap-1");

    expect(mockApiAuthFetch).toHaveBeenCalledWith({
      api: "users",
      url: "me/bookmarks/snap-1",
      options: { method: "PUT" },
    });
    expect(result.snapId).toBe("snap-1");
  });

  it("unsaves with DELETE /users/me/bookmarks/:snapId", async () => {
    mockApiAuthFetch.mockResolvedValueOnce({ success: true, data: null });

    await removeBookmark("snap-1");

    expect(mockApiAuthFetch).toHaveBeenCalledWith({
      api: "users",
      url: "me/bookmarks/snap-1",
      options: { method: "DELETE" },
    });
  });

  it("rejects an empty id without calling the API", async () => {
    await expect(addBookmark("")).rejects.toBeInstanceOf(ApiError);
    await expect(removeBookmark("")).rejects.toBeInstanceOf(ApiError);
    expect(mockApiAuthFetch).not.toHaveBeenCalled();
  });

  it("reads a raw array payload", () => {
    expect(
      normalizeBookmarkList([{ snapId: "a" }, { snapId: "b", userId: "u" }]),
    ).toEqual([
      { userId: "", snapId: "a", createdAt: undefined },
      { userId: "u", snapId: "b", createdAt: undefined },
    ]);
  });

  it("knows whether a snap is bookmarked", () => {
    const bookmarks = [{ userId: "u1", snapId: "snap-1" }];
    expect(isSnapBookmarked(bookmarks, "snap-1")).toBe(true);
    expect(isSnapBookmarked(bookmarks, "snap-2")).toBe(false);
  });
});
