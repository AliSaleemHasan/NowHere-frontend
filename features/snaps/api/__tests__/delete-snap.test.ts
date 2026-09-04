import { ApiError } from "@/lib/http/api-error";

const mockApiAuthFetch = jest.fn();

jest.mock("@/lib/fetch-api", () => ({
  apiAuthFetch: (...args: unknown[]) => mockApiAuthFetch(...args),
}));

import { deleteSnap } from "../delete-snap";

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
