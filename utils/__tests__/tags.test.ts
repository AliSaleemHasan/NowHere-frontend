import {
  displayTag,
  expandTagsForQuery,
  parseTagsParam,
  tagDescription,
  Tags,
} from "../constants";

describe("tags", () => {
  it("renders the deprecated typo as Promotion", () => {
    expect(displayTag(Tags.PROOMOTION)).toBe("Promotion");
    expect(displayTag(Tags.PROMOTION)).toBe("Promotion");
  });

  it("includes PROOMOTION when querying PROMOTION", () => {
    expect(expandTagsForQuery([Tags.PROMOTION, Tags.SOCIAL])).toEqual([
      Tags.PROMOTION,
      Tags.SOCIAL,
      Tags.PROOMOTION,
    ]);
  });

  it("parses tag query params and drops unknown values", () => {
    expect(parseTagsParam("SOCIAL,LOST,not-a-tag")).toEqual([
      Tags.SOCIAL,
      Tags.LOST,
    ]);
    expect(parseTagsParam(["FINDINGS", "nope"])).toEqual([Tags.FINDINGS]);
    expect(parseTagsParam(undefined)).toEqual([]);
  });

  it("explains each tag for the details screen", () => {
    expect(tagDescription(Tags.HIDDEN_GEM)).toBe(
      "A local spot that is easy to miss.",
    );
    expect(tagDescription("unknown")).toBe(
      "A nearby moment from someone around you.",
    );
  });
});
