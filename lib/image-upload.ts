import { ApiError } from "./http/api-error";
import { isLocalFileUri, rewriteStorageUploadUrl } from "./storage-url";

export const ALLOWED_IMAGE_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AllowedImageContentType =
  (typeof ALLOWED_IMAGE_CONTENT_TYPES)[number];

export type StoragePrefix = "snaps" | "profile";

export const MAX_SNAP_IMAGES = 4;
export const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024;

export type ReactNativeFilePart = {
  uri: string;
  name: string;
  type: string;
};

export function filenameFromUri(
  uri: string,
  fallbackPrefix = "photo",
): string {
  const name = uri.split("/").pop();
  if (name && name.includes(".")) return name;
  return `${fallbackPrefix}_${Date.now()}.jpg`;
}

export function contentTypeFromFilename(
  filename: string,
): AllowedImageContentType {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  return "image/jpeg";
}

export function appendNativeFile(
  form: FormData,
  field: string,
  file: ReactNativeFilePart,
): void {
  form.append(field, file as unknown as Blob);
}

function readLocalUriAsBlob(uri: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = () => {
      if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300)) {
        resolve(xhr.response as Blob);
        return;
      }
      reject(
        new ApiError("Could not read the photo from the camera.", xhr.status),
      );
    };
    xhr.onerror = () => {
      reject(
        new ApiError(
          "Could not read the photo from the camera. Please try taking it again.",
          0,
        ),
      );
    };
    xhr.open("GET", uri);
    xhr.send();
  });
}

export async function blobFromUri(uri: string): Promise<Blob> {
  if (isLocalFileUri(uri)) {
    return readLocalUriAsBlob(uri);
  }

  try {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error("Could not read the selected image.");
    }
    return await response.blob();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      "Could not read the photo from the camera. Please try taking it again.",
      0,
      undefined,
      error,
    );
  }
}

export async function putFileToPresignedUrl(
  uploadUrl: string,
  fileUri: string,
  contentType: AllowedImageContentType,
): Promise<void> {
  const blob = await blobFromUri(fileUri);
  const targetUrl = rewriteStorageUploadUrl(uploadUrl);

  let uploadResult: Response;
  try {
    uploadResult = await fetch(targetUrl, {
      method: "PUT",
      body: blob,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    throw new ApiError(
      "Could not upload the photo to storage. Object storage is not reachable from this device.",
      0,
      undefined,
      error,
    );
  }

  if (!uploadResult.ok) {
    const detail = await uploadResult.text().catch(() => "");
    throw new ApiError(
      uploadResult.status === 403
        ? "Storage rejected the upload (403). The signed URL host and Content-Type must match the PUT request."
        : `Direct storage upload failed (${uploadResult.status})`,
      uploadResult.status,
      undefined,
      detail,
    );
  }
}
