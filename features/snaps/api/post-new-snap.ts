import { apiAuthFetch } from "@/lib/fetch-api";
import { ApiError } from "@/lib/http/api-error";
import { Tags } from "@/utils";

export interface PresignedUploadItem {
  uploadUrl: string;
  key: string;
}

export interface PresignedUploadBatchResponse {
  uploads?: PresignedUploadItem[];
  uploadUrl?: string;
  key?: string;
}

export interface CreateSnapInput {
  description: string;
  tag: Tags;
  location: any;
  snaps: string[];
}

/**
 * Uploads snap photos directly to Object Storage via presigned URLs,
 * then creates the snap in the backend with lightweight storage keys.
 * This completely prevents huge file buffers from going through NATS/Gateway.
 */
export async function createSnapWithDirectUpload(input: CreateSnapInput) {
  const { snaps: fileUris, description, tag, location } = input;

  let storageKeys: string[] = [];

  if (fileUris && fileUris.length > 0) {
    // 1. Request presigned upload URLs from storage service via gateway
    const filesMeta = fileUris.map((uri) => {
      const filename = uri.split("/").pop() || `photo_${Date.now()}.jpg`;
      const ext = filename.split(".").pop()?.toLowerCase() || "jpg";
      const contentType =
        ext === "png"
          ? "image/png"
          : ext === "webp"
            ? "image/webp"
            : "image/jpeg";
      return { filename, contentType };
    });

    const presignedRes = await apiAuthFetch<PresignedUploadBatchResponse>({
      api: "storage",
      url: "presigned-upload",
      options: {
        method: "POST",
        body: JSON.stringify({ files: filesMeta }),
      },
    });

    const uploads: PresignedUploadItem[] =
      presignedRes.data?.uploads ||
      (presignedRes.data?.uploadUrl && presignedRes.data?.key
        ? [{ uploadUrl: presignedRes.data.uploadUrl, key: presignedRes.data.key }]
        : []);

    if (uploads.length !== fileUris.length) {
      throw new ApiError(
        "Failed to obtain upload authorization for all images",
        500,
      );
    }

    // 2. Upload each file directly to S3/MinIO in parallel (bypassing Gateway and NATS)
    const uploadTasks = fileUris.map(async (uri, index) => {
      const uploadItem = uploads[index];
      const contentType = filesMeta[index].contentType;

      const fileResponse = await fetch(uri);
      const blob = await fileResponse.blob();

      const uploadResult = await fetch(uploadItem.uploadUrl, {
        method: "PUT",
        body: blob,
        headers: {
          "Content-Type": contentType,
        },
      });

      if (!uploadResult.ok) {
        throw new ApiError(
          `Direct storage upload failed (${uploadResult.status}): ${uploadResult.statusText}`,
          uploadResult.status,
        );
      }

      return uploadItem.key;
    });

    storageKeys = await Promise.all(uploadTasks);
  }

  // 3. Create snap with pre-uploaded storage keys (~1 KB lightweight JSON)
  return await apiAuthFetch({
    api: "snaps",
    url: "",
    options: {
      method: "POST",
      body: JSON.stringify({
        description,
        tag,
        location,
        snaps: storageKeys,
      }),
    },
  });
}

export const PostSnapBody = (
  snaps: Array<string>,
  param_name: string = "snaps",
) => {
  const payload = new FormData();

  snaps.forEach((snap) => {
    payload.append(param_name, {
      uri: snap,
      name: snap.split("/").pop() || crypto.randomUUID(),
      type: `image/${snap.split(".").pop()}`,
    } as any);
  });

  return payload;
};
