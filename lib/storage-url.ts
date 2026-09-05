const INTERNAL_STORAGE_HOSTS = new Set([
  "minio-local",
  "minio",
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
]);

export function publicStorageOrigin(): string | undefined {
  const explicit = process.env.EXPO_PUBLIC_STORAGE_URL?.trim();
  if (explicit) {
    try {
      return new URL(explicit).origin;
    } catch {
      return explicit.replace(/\/$/, "");
    }
  }

  const gateway = process.env.EXPO_PUBLIC_GATEWAY_URL?.trim();
  if (!gateway) return undefined;

  try {
    const url = new URL(gateway);
    url.port = "9000";
    return url.origin;
  } catch {
    return undefined;
  }
}

/**
 * Presigned URLs are often minted with Docker hostnames (`minio-local`).
 * Those are unreachable from a phone, which surfaces as a generic
 * "network request failed". Rewrite to the LAN origin the app already uses.
 */
export function rewriteStorageUploadUrl(uploadUrl: string): string {
  try {
    const parsed = new URL(uploadUrl);
    if (!INTERNAL_STORAGE_HOSTS.has(parsed.hostname)) {
      return uploadUrl;
    }

    const origin = publicStorageOrigin();
    if (!origin) return uploadUrl;

    const publicUrl = new URL(origin);
    parsed.protocol = publicUrl.protocol;
    parsed.hostname = publicUrl.hostname;
    parsed.port = publicUrl.port;
    return parsed.toString();
  } catch {
    return uploadUrl;
  }
}

export function isLocalFileUri(uri: string): boolean {
  return (
    uri.startsWith("file:") ||
    uri.startsWith("content:") ||
    uri.startsWith("ph://") ||
    uri.startsWith("assets-library:")
  );
}

export function publicObjectUrl(value?: string | null): string | undefined {
  if (!value) return undefined;
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return rewriteStorageUploadUrl(value);
  }
  return undefined;
}
