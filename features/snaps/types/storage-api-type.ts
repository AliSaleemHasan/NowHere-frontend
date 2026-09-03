import type { AllowedImageContentType, StoragePrefix } from "@/lib/image-upload";

export type PresignFile = {
  filename: string;
  contentType: AllowedImageContentType;
};

export type PresignedUploadItem = {
  uploadUrl: string;
  key: string;
};

export type PresignedUploadBatchRequest = {
  prefix: StoragePrefix;
  files: PresignFile[];
};

export type PresignedUploadBatchResponse = {
  uploads: PresignedUploadItem[];
};

export type PresignedUploadSingleResponse = PresignedUploadItem;
