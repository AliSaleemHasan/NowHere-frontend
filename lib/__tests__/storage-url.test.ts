import {
  publicObjectUrl,
  publicStorageOrigin,
  rewriteStorageUploadUrl,
} from "../storage-url";

describe("storage URL rewriting", () => {
  const originalGateway = process.env.EXPO_PUBLIC_GATEWAY_URL;
  const originalStorage = process.env.EXPO_PUBLIC_STORAGE_URL;

  beforeEach(() => {
    process.env.EXPO_PUBLIC_GATEWAY_URL = "http://192.168.1.69:3005";
    delete process.env.EXPO_PUBLIC_STORAGE_URL;
  });

  afterAll(() => {
    process.env.EXPO_PUBLIC_GATEWAY_URL = originalGateway;
    process.env.EXPO_PUBLIC_STORAGE_URL = originalStorage;
  });

  it("derives MinIO origin from the gateway host", () => {
    expect(publicStorageOrigin()).toBe("http://192.168.1.69:9000");
  });

  it("rewrites docker MinIO hosts to the device-reachable origin", () => {
    const signed =
      "http://minio-local:9000/mysnapsbucket/snaps/a.jpg?X-Amz-Signature=abc";
    expect(rewriteStorageUploadUrl(signed)).toBe(
      "http://192.168.1.69:9000/mysnapsbucket/snaps/a.jpg?X-Amz-Signature=abc",
    );
  });

  it("leaves already-public hosts unchanged", () => {
    const signed =
      "http://192.168.1.69:9000/mysnapsbucket/snaps/a.jpg?X-Amz-Signature=abc";
    expect(rewriteStorageUploadUrl(signed)).toBe(signed);
  });

  it("only rewrites http(s) object URLs, not storage keys", () => {
    expect(publicObjectUrl("profile/u1/a.jpg")).toBeUndefined();
    expect(
      publicObjectUrl(
        "http://minio-local:9000/mysnapsbucket/profile/u1/a.jpg",
      ),
    ).toBe("http://192.168.1.69:9000/mysnapsbucket/profile/u1/a.jpg");
  });
});
