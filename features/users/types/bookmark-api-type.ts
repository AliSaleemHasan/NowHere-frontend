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
