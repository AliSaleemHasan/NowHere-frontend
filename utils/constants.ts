import { i18n } from "@/lib/i18n";

export enum Tags {
  PROMOTION = "PROMOTION",
  /** @deprecated typo kept for existing Mongo documents */
  PROOMOTION = "PROOMOTION",
  INTERESTING = "INTERESTING",
  FINDINGS = "FINDINGS",
  LOST = "LOST",
  HIDDEN_GEM = "HIDDEN_GEM",
  SOCIAL = "SOCIAL",
}

export const SELECTABLE_TAGS = [
  Tags.SOCIAL,
  Tags.INTERESTING,
  Tags.HIDDEN_GEM,
  Tags.FINDINGS,
  Tags.LOST,
  Tags.PROMOTION,
] as const;

export type SelectableTag = (typeof SELECTABLE_TAGS)[number];

export function tagDescription(tag: string): string {
  const key = isTag(tag) ? tag : Tags.SOCIAL;
  return i18n.t(`tags.descriptions.${key}`);
}

export const TagsColors: Record<Tags, string> = {
  PROMOTION: "#16a34a",
  PROOMOTION: "#16a34a",
  INTERESTING: "#0ea5e9",
  FINDINGS: "#ef4444",
  LOST: "#7c3aed",
  HIDDEN_GEM: "#06b6d4",
  SOCIAL: "#0f0d23",
};

export function isTag(value: string): value is Tags {
  return (Object.values(Tags) as string[]).includes(value);
}

export function parseTagsParam(
  raw: string | string[] | undefined,
): Tags[] {
  if (!raw) return [];
  const values = Array.isArray(raw) ? raw : raw.split(",");
  return values.filter(isTag);
}

export function displayTag(tag: string): string {
  return isTag(tag) ? i18n.t(`tags.labels.${tag}`) : tag;
}

export function tagColor(tag: string): string {
  return isTag(tag) ? TagsColors[tag] : TagsColors.SOCIAL;
}

export function expandTagsForQuery(tags: readonly Tags[]): Tags[] {
  if (tags.includes(Tags.PROMOTION) && !tags.includes(Tags.PROOMOTION)) {
    return [...tags, Tags.PROOMOTION];
  }
  return [...tags];
}

export type APIS = "users" | "snaps" | "storage" | "auth";

export const getApiURL = (api?: APIS) => {
  const base = (process.env.EXPO_PUBLIC_GATEWAY_URL ?? "")
    .trim()
    .replace(/\/+$/, "");
  if (!api) return base;
  return base ? `${base}/${api}` : api;
};

export const SNAPS_SOCKET_URL = process.env.EXPO_PUBLIC_SNAPS_SOCKET_URL || "";
