import { filterHiddenSnaps } from "../filter-hidden-snaps";

const snaps = [
  { id: "keep-a", tag: "SOCIAL" },
  { id: "hide-me", tag: "LOST" },
  { _id: "also-hide", tag: "FINDINGS" },
  { id: "keep-b", tag: "HIDDEN_GEM" },
];

describe("filterHiddenSnaps", () => {
  it("drops hidden ids from map/list snap arrays", () => {
    const visible = filterHiddenSnaps(snaps, ["hide-me", "also-hide"]);

    expect(visible.map((snap) => snap.id ?? snap._id)).toEqual([
      "keep-a",
      "keep-b",
    ]);
  });

  it("returns a copy of the list when nothing is hidden", () => {
    const visible = filterHiddenSnaps(snaps, []);

    expect(visible).toEqual(snaps);
    expect(visible).not.toBe(snaps);
  });

  it("ignores empty hidden ids", () => {
    expect(filterHiddenSnaps(snaps, ["", "hide-me"])).toHaveLength(3);
  });
});
