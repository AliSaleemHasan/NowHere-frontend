jest.mock("@/lib/fetch-api", () => ({
  apiAuthFetch: jest.fn(),
}));

import {
  contentTypeFromFilename,
  filenameFromUri,
  normalizePresignedUploads,
} from "../image-upload";

describe("image upload helpers", () => {
  it("maps jpg and jpeg to image/jpeg", () => {
    expect(contentTypeFromFilename("photo.jpg")).toBe("image/jpeg");
    expect(contentTypeFromFilename("photo.jpeg")).toBe("image/jpeg");
  });

  it("maps png and webp", () => {
    expect(contentTypeFromFilename("a.png")).toBe("image/png");
    expect(contentTypeFromFilename("a.webp")).toBe("image/webp");
  });

  it("extracts a filename from a file uri", () => {
    expect(filenameFromUri("file:///tmp/snaps/coffee.png")).toBe("coffee.png");
  });

  it("normalizes batch and single presign responses", () => {
    expect(
      normalizePresignedUploads({
        uploads: [{ uploadUrl: "https://a", key: "profile/u/a.jpg" }],
      }),
    ).toEqual([{ uploadUrl: "https://a", key: "profile/u/a.jpg" }]);
    expect(
      normalizePresignedUploads({
        uploadUrl: "https://b",
        key: "snaps/u/b.jpg",
      }),
    ).toEqual([{ uploadUrl: "https://b", key: "snaps/u/b.jpg" }]);
    expect(normalizePresignedUploads(undefined)).toEqual([]);
  });
});
