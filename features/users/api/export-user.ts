import { apiAuthFetch } from "@/lib/fetch-api";
import { ApiError } from "@/lib/http/api-error";
import type { UserExport } from "../types/export-api-type";

export async function exportAccount(): Promise<UserExport> {
  const response = await apiAuthFetch<UserExport>({
    api: "users",
    url: "me/export",
    options: {
      method: "GET",
    },
  });

  if (!response.data) {
    throw new ApiError("", 500);
  }

  return response.data;
}
