import {
  contentTypeFromFilename,
  filenameFromUri,
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
});
