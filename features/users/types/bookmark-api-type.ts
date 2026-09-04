export type SnapBookmark = {
  userId: string;
  snapId: string;
  createdAt?: string;
};

export function isSnapBookmarked(
  bookmarks: readonly SnapBookmark[],
  snapId: string,
): boolean {
  return Boolean(snapId) && bookmarks.some((item) => item.snapId === snapId);
}

export function withBookmarkAdded(
  bookmarks: readonly SnapBookmark[] | undefined,
  bookmark: SnapBookmark,
): SnapBookmark[] {
  const current = bookmarks ?? [];
  if (!bookmark.snapId || isSnapBookmarked(current, bookmark.snapId)) {
    return [...current];
  }
  return [bookmark, ...current];
}

export function withBookmarkRemoved(
  bookmarks: readonly SnapBookmark[] | undefined,
  snapId: string,
): SnapBookmark[] {
  return (bookmarks ?? []).filter((item) => item.snapId !== snapId);
}
