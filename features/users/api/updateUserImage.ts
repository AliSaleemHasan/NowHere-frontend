import { apiAuthFetch } from "@/lib/fetch-api";
import { ApiError } from "@/lib/http/api-error";
import {
  MAX_PROFILE_IMAGE_BYTES,
  uploadSingleImage,
} from "@/lib/image-upload";
import { publicObjectUrl } from "@/lib/storage-url";
import type { GetUserResponse } from "@/types/api";

export async function updateUserImage(
  photoUri: string,
): Promise<GetUserResponse> {
  const key = await uploadSingleImage({
    uri: photoUri,
    prefix: "profile",
    maxBytes: MAX_PROFILE_IMAGE_BYTES,
  });

  const response = await apiAuthFetch<GetUserResponse>({
    url: "image",
    api: "users",
    options: {
      method: "PUT",
      body: { key },
    },
  });

  if (!response.data?.user) {
    throw new ApiError(
      "Profile photo was uploaded but the server returned no user.",
      500,
    );
  }

  return {
    ...response.data,
    userImage:
      publicObjectUrl(response.data.userImage) ?? response.data.userImage,
  };
}
