import { handleArrayQueryParam } from "../handle-array-query-param";

describe("handleArrayQueryParam", () => {
  it("returns an empty string when no tags are selected", () => {
    expect(handleArrayQueryParam([], "tags")).toBe("");
  });

  it("emits repeated keys for a tag list", () => {
    expect(handleArrayQueryParam(["LOST", "SOCIAL"], "tags")).toBe(
      "?tags=LOST&tags=SOCIAL",
    );
  });

  it("splits a comma-separated string into repeated keys", () => {
    expect(handleArrayQueryParam("LOST,SOCIAL", "tags")).toBe(
      "?tags=LOST&tags=SOCIAL",
    );
  });
});
