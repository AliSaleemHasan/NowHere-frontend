import { apiAuthFetch } from "@/lib/fetch-api";
import { ApiError } from "@/lib/http/api-error";
import {
  appendNativeFile,
  blobFromUri,
  contentTypeFromFilename,
  filenameFromUri,
  MAX_PROFILE_IMAGE_BYTES,
} from "@/lib/image-upload";
import type { GetUserResponse } from "@/types/api";

export async function updateUserImage(
  photoUri: string,
): Promise<GetUserResponse> {
  const filename = filenameFromUri(photoUri, "profile");
  const type = contentTypeFromFilename(filename);
  const blob = await blobFromUri(photoUri);

  if (blob.size > MAX_PROFILE_IMAGE_BYTES) {
    throw new ApiError("Profile photos must be 5MB or smaller.", 400);
  }

  const payload = new FormData();
  appendNativeFile(payload, "photo", {
    uri: photoUri,
    name: filename,
    type,
  });

  const response = await apiAuthFetch<GetUserResponse>({
    url: "image",
    api: "users",
    contentType: "files",
    options: {
      method: "PUT",
      body: payload,
    },
  });

  if (!response.data?.user) {
    throw new ApiError(
      "Profile photo was uploaded but the server returned no user.",
      500,
    );
  }

  return response.data;
}
