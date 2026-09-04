import { useQuery } from "@tanstack/react-query";
import { listBookmarks } from "./bookmarks";
import { userQueryKeys } from "./user-query";

export function useBookmarks() {
  return useQuery({
    queryKey: userQueryKeys.bookmarks,
    throwOnError: false,
    queryFn: listBookmarks,
    refetchOnWindowFocus: true,
  });
}
