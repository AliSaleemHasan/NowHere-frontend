import { Tags } from "@/utils";
import { snapSafetyActions } from "../snap-safety-actions";

describe("snapSafetyActions", () => {
  it("shows Found on LOST and FINDINGS while open, for any viewer", () => {
    expect(
      snapSafetyActions({
        tag: Tags.LOST,
        resolution: "OPEN",
        isOwnSnap: false,
      }),
    ).toEqual({ showFound: true, showReopen: false });

    expect(
      snapSafetyActions({
        tag: Tags.FINDINGS,
        resolution: "OPEN",
        isOwnSnap: true,
      }),
    ).toEqual({ showFound: true, showReopen: false });
  });

  it("hides Found on other tags", () => {
    expect(
      snapSafetyActions({
        tag: Tags.SOCIAL,
        resolution: "OPEN",
        isOwnSnap: true,
      }),
    ).toEqual({ showFound: false, showReopen: false });

    expect(
      snapSafetyActions({
        tag: Tags.HIDDEN_GEM,
        resolution: "FOUND",
        isOwnSnap: true,
      }),
    ).toEqual({ showFound: false, showReopen: false });
  });

  it("shows Reopen only on the author’s FOUND LOST/FINDINGS snap", () => {
    expect(
      snapSafetyActions({
        tag: Tags.LOST,
        resolution: "FOUND",
        isOwnSnap: true,
      }),
    ).toEqual({ showFound: false, showReopen: true });

    expect(
      snapSafetyActions({
        tag: Tags.FINDINGS,
        resolution: "FOUND",
        isOwnSnap: false,
      }),
    ).toEqual({ showFound: false, showReopen: false });
  });
});
