import { ApiError } from "@/lib/http/api-error";
import { REPORT_REASONS } from "../../types/report-reasons";

const mockApiAuthFetch = jest.fn();

jest.mock("@/lib/fetch-api", () => ({
  apiAuthFetch: (...args: unknown[]) => mockApiAuthFetch(...args),
}));

import { isDuplicateReportError, reportSnap } from "../report-snap";

describe("reportSnap", () => {
  beforeEach(() => {
    mockApiAuthFetch.mockReset();
    mockApiAuthFetch.mockResolvedValue({ success: true, data: null });
  });

  it("posts only enum reasons to /snaps/:id/report", async () => {
    for (const reason of REPORT_REASONS) {
      mockApiAuthFetch.mockClear();
      await reportSnap("snap-1", { reason, details: "  note  " });
      expect(mockApiAuthFetch).toHaveBeenCalledWith({
        api: "snaps",
        url: "snap-1/report",
        options: {
          method: "POST",
          body: { reason, details: "note" },
        },
      });
    }
  });

  it("rejects a reason that is not in the enum", async () => {
    await expect(
      reportSnap("snap-1", { reason: "scam" as never }),
    ).rejects.toBeInstanceOf(ApiError);
    expect(mockApiAuthFetch).not.toHaveBeenCalled();
  });

  it("maps duplicate reports from code or 409", () => {
    expect(
      isDuplicateReportError(
        new ApiError("conflict", 409, {
          type: "about:blank",
          title: "Conflict",
          status: 409,
          detail: "already",
          instance: "",
          timestamp: "",
          code: "DUPLICATE_REPORT",
        }),
      ),
    ).toBe(true);
    expect(isDuplicateReportError(new ApiError("conflict", 409))).toBe(true);
    expect(isDuplicateReportError(new ApiError("nope", 400))).toBe(false);
  });
});
