import { getSnapId } from "../types/snaps-api-type";

export function filterHiddenSnaps<T extends { id?: unknown; _id?: unknown }>(
  snaps: readonly T[],
  hiddenSnapIds: readonly string[],
): T[] {
  if (hiddenSnapIds.length === 0) return [...snaps];
  const hidden = new Set(hiddenSnapIds);
  return snaps.filter((snap) => {
    const id = getSnapId(snap);
    return !id || !hidden.has(id);
  });
}
