import { i18n } from "@/lib/i18n";
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

  it("translates labels and descriptions in German", async () => {
    await i18n.changeLanguage("de");
    expect(displayTag(Tags.HIDDEN_GEM)).toBe("Geheimtipp");
    expect(tagDescription(Tags.HIDDEN_GEM)).toBe(
      "Ein lokaler Ort, den man leicht übersieht.",
    );
  });
});
