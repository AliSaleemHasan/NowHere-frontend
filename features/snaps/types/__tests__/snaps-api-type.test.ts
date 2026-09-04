import { Tags } from "@/utils";
import { getSnapId, normalizeSnap } from "../snaps-api-type";

describe("normalizeSnap", () => {
  it("normalizes a valid payload and falls back unknown tags to SOCIAL", () => {
    const snap = normalizeSnap({
      id: "snap-1",
      _userId: "user-1",
      description: "Coffee",
      snaps: ["key.jpg", 12],
      location: { type: "Point", coordinates: [13.4, 52.5] },
      tag: "not-a-tag",
      status: "SUCCESS",
    });

    expect(snap).toMatchObject({
      id: "snap-1",
      tag: Tags.SOCIAL,
      status: "SUCCESS",
      resolution: "OPEN",
      snaps: ["key.jpg"],
      location: { type: "Point", coordinates: [13.4, 52.5] },
    });
  });

  it("keeps FOUND resolution, note, and expiresAt", () => {
    const snap = normalizeSnap({
      id: "snap-found",
      _userId: "user-1",
      description: "Keys",
      snaps: ["key.jpg"],
      location: { type: "Point", coordinates: [13.4, 52.5] },
      tag: Tags.LOST,
      resolution: "FOUND",
      resolutionNote: "Under the bench",
      expiresAt: "2026-09-10T00:00:00.000Z",
    });

    expect(snap).toMatchObject({
      id: "snap-found",
      resolution: "FOUND",
      resolutionNote: "Under the bench",
      expiresAt: "2026-09-10T00:00:00.000Z",
    });
  });

  it("reads Mongo-style ids and rejects invalid coordinates", () => {
    expect(getSnapId({ _id: { $oid: "abc123" } })).toBe("abc123");
    expect(
      normalizeSnap({
        id: "snap-2",
        location: { type: "Point", coordinates: [0, 0] },
      }),
    ).toBeUndefined();
  });
});
