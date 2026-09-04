import { isReportReason, REPORT_REASONS } from "../report-reasons";

describe("REPORT_REASONS", () => {
  it("is only the four contract values", () => {
    expect(REPORT_REASONS).toEqual([
      "spam",
      "inappropriate",
      "wrong_place",
      "other",
    ]);
    expect(REPORT_REASONS).toHaveLength(4);
  });

  it("accepts only those values", () => {
    for (const reason of REPORT_REASONS) {
      expect(isReportReason(reason)).toBe(true);
    }
    expect(isReportReason("scam")).toBe(false);
    expect(isReportReason("SPAM")).toBe(false);
    expect(isReportReason("")).toBe(false);
  });
});
