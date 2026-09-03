import {
  contentTypeFromFilename,
  filenameFromUri,
  MAX_SNAP_IMAGES,
  putFileToPresignedUrl,
} from "@/lib/image-upload";
import { apiAuthFetch } from "@/lib/fetch-api";
import { ApiError } from "@/lib/http/api-error";
import { Tags } from "@/utils";
import {
  isValidSnapLocation,
  type Snap,
  type SnapLocation,
} from "../types/snaps-api-type";
import type {
  PresignFile,
  PresignedUploadBatchResponse,
  PresignedUploadItem,
  PresignedUploadSingleResponse,
} from "../types/storage-api-type";

export interface CreateSnapInput {
  description: string;
  tag: Tags;
  location: SnapLocation;
  snaps: string[];
}

function normalizeUploads(
  data: PresignedUploadBatchResponse | PresignedUploadSingleResponse | undefined,
): PresignedUploadItem[] {
  if (!data) return [];
  if ("uploads" in data && Array.isArray(data.uploads)) {
    return data.uploads;
  }
  if ("uploadUrl" in data && "key" in data && data.uploadUrl && data.key) {
    return [{ uploadUrl: data.uploadUrl, key: data.key }];
  }
  return [];
}

export async function presignSnapUploads(
  files: PresignFile[],
): Promise<PresignedUploadItem[]> {
  const response = await apiAuthFetch<
    PresignedUploadBatchResponse | PresignedUploadSingleResponse
  >({
    api: "storage",
    url: "presigned-upload",
    options: {
      method: "POST",
      body: {
        prefix: "snaps",
        files,
      },
    },
  });

  return normalizeUploads(response.data);
}

function requireCreateLocation(location: SnapLocation): SnapLocation {
  if (!isValidSnapLocation(location)) {
    throw new ApiError(
      "A valid GPS location is required to share a snap.",
      400,
    );
  }
  return {
    type: "Point",
    coordinates: [
      Number(location.coordinates[0]),
      Number(location.coordinates[1]),
    ],
  };
}

export async function createSnap(body: CreateSnapInput): Promise<Snap> {
  const location = requireCreateLocation(body.location);
  const response = await apiAuthFetch<Snap>({
    api: "snaps",
    url: "",
    options: {
      method: "POST",
      body: {
        description: body.description,
        tag: body.tag,
        location,
        snaps: body.snaps,
      },
    },
  });

  if (!response.data) {
    throw new ApiError("Snap was created but the server returned no data", 500);
  }

  return response.data;
}

/**
 * Presign → PUT bytes to object storage → POST snap with storage keys.
 * Files never go through the gateway.
 */
export async function createSnapWithDirectUpload(
  input: CreateSnapInput,
): Promise<Snap> {
  const location = requireCreateLocation(input.location);
  const fileUris = input.snaps.filter((uri) => typeof uri === "string" && uri.length > 0);

  if (fileUris.length === 0) {
    throw new ApiError("Add at least one photo before sharing a snap.", 400);
  }
  if (fileUris.length > MAX_SNAP_IMAGES) {
    throw new ApiError(`You can attach at most ${MAX_SNAP_IMAGES} photos.`, 400);
  }

  const filesMeta: PresignFile[] = fileUris.map((uri) => {
    const filename = filenameFromUri(uri);
    return {
      filename,
      contentType: contentTypeFromFilename(filename),
    };
  });

  let uploads: PresignedUploadItem[];
  try {
    uploads = await presignSnapUploads(filesMeta);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      "Could not start the photo upload. Check that the API gateway is reachable.",
      0,
      undefined,
      error,
    );
  }

  if (uploads.length !== fileUris.length) {
    throw new ApiError(
      "Failed to obtain upload authorization for all images",
      500,
    );
  }

  const storageKeys = await Promise.all(
    fileUris.map(async (uri, index) => {
      const uploadItem = uploads[index];
      await putFileToPresignedUrl(
        uploadItem.uploadUrl,
        uri,
        filesMeta[index].contentType,
      );
      return uploadItem.key;
    }),
  );

  return createSnap({
    description: input.description,
    tag: input.tag,
    location,
    snaps: storageKeys,
  });
}
