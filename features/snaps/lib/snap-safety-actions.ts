import { Tags } from "@/utils";
import type { SnapResolution } from "../types/snaps-api-type";

const RESOLVABLE_TAGS: ReadonlySet<string> = new Set([
  Tags.LOST,
  Tags.FINDINGS,
]);

function isResolvableTag(tag: string): boolean {
  return RESOLVABLE_TAGS.has(tag);
}

export function isFoundResolution(
  resolution?: SnapResolution,
): boolean {
  return resolution === "FOUND";
}

export function snapSafetyActions(input: {
  tag: string;
  resolution?: SnapResolution;
  isOwnSnap: boolean;
}): { showFound: boolean; showReopen: boolean } {
  const resolvable = isResolvableTag(input.tag);
  const found = isFoundResolution(input.resolution);
  return {
    showFound: resolvable && !found,
    showReopen: resolvable && found && input.isOwnSnap,
  };
}
