import {
  isValidGeoPoint,
  toGeoPoint,
  type GeoPoint,
} from "@/lib/geo";
import { isTag, Tags } from "@/utils";

export const SNAP_STATUSES = [
  "UPLOADING",
  "FAILED",
  "SUCCESS",
  "PROCESSING",
] as const;

export type SnapStatus = (typeof SNAP_STATUSES)[number];

export const SNAP_RESOLUTIONS = ["OPEN", "FOUND"] as const;

export type SnapResolution = (typeof SNAP_RESOLUTIONS)[number];

export const MAX_RESOLUTION_NOTE = 280;

export type SnapLocation = GeoPoint;
export const isValidSnapLocation = isValidGeoPoint;
export const toSnapLocation = toGeoPoint;

export function isSnapStatus(value: unknown): value is SnapStatus {
  return (
    typeof value === "string" &&
    (SNAP_STATUSES as readonly string[]).includes(value)
  );
}

function isSnapResolution(value: unknown): value is SnapResolution {
  return (
    typeof value === "string" &&
    (SNAP_RESOLUTIONS as readonly string[]).includes(value)
  );
}

export type CreateSnapRequest = {
  description: string;
  location: SnapLocation;
  snaps: string[];
  tag?: Tags;
};

export type Snap = {
  id: string;
  _id?: string;
  _userId: string;
  description: string;
  snaps: string[];
  location: SnapLocation;
  tag: Tags;
  status?: SnapStatus;
  resolution?: SnapResolution;
  resolutionNote?: string;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateSnapResponse = Snap;

export type FindSnapResponse = {
  snap: Snap;
  imageKeys: string[];
};

export function getSnapId(snap: {
  id?: unknown;
  _id?: unknown;
}): string | undefined {
  const raw = snap.id ?? snap._id;
  if (typeof raw === "string" && raw.length > 0) return raw;
  if (raw && typeof raw === "object") {
    if ("$oid" in raw && typeof raw.$oid === "string") return raw.$oid;
    const asString = String(raw);
    if (asString && asString !== "[object Object]") return asString;
  }
  return undefined;
}

export function normalizeSnap(input: unknown): Snap | undefined {
  if (!input || typeof input !== "object") return undefined;
  const snap = input as Record<string, unknown>;
  const id = getSnapId(snap);
  const location = snap.location as { coordinates?: unknown } | undefined;
  const coords = Array.isArray(location?.coordinates)
    ? location.coordinates
    : undefined;
  if (!id || !coords || coords.length < 2) return undefined;

  const lng = Number(coords[0]);
  const lat = Number(coords[1]);
  const locationPoint = {
    type: "Point" as const,
    coordinates: [lng, lat] as [number, number],
  };
  if (!isValidGeoPoint(locationPoint)) return undefined;

  const rawTag = typeof snap.tag === "string" ? snap.tag : "";
  const resolutionNote =
    typeof snap.resolutionNote === "string" && snap.resolutionNote.trim()
      ? snap.resolutionNote
      : undefined;

  return {
    id,
    _id: typeof snap._id === "string" ? snap._id : id,
    _userId: String(snap._userId ?? ""),
    description: String(snap.description ?? ""),
    snaps: Array.isArray(snap.snaps)
      ? snap.snaps.filter((item): item is string => typeof item === "string")
      : [],
    location: locationPoint,
    tag: isTag(rawTag) ? rawTag : Tags.SOCIAL,
    status: isSnapStatus(snap.status) ? snap.status : undefined,
    resolution: isSnapResolution(snap.resolution)
      ? snap.resolution
      : "OPEN",
    resolutionNote,
    expiresAt:
      typeof snap.expiresAt === "string" ? snap.expiresAt : undefined,
    createdAt:
      typeof snap.createdAt === "string" ? snap.createdAt : undefined,
    updatedAt:
      typeof snap.updatedAt === "string" ? snap.updatedAt : undefined,
  };
}
