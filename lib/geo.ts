import { i18n } from "@/lib/i18n";
import { Linking, Platform } from "react-native";

const EARTH_RADIUS_METERS = 6_371_000;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Haversine distance between two [lng, lat] points, in meters. */
export function haversineDistanceMeters(
  from: readonly [number, number],
  to: readonly [number, number],
): number {
  const [lng1, lat1] = from;
  const [lng2, lat2] = to;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_METERS * c;
}

export type DistanceFormatStyle = "long" | "short";

export function formatDistanceAway(
  meters: number,
  style: DistanceFormatStyle = "long",
): string {
  if (!Number.isFinite(meters) || meters < 0) return i18n.t("geo.nearby");
  if (meters < 15) return i18n.t("geo.rightHere");
  if (meters < 1000) {
    const value = i18n.t("geo.meters", { count: Math.round(meters) });
    return style === "short" ? value : i18n.t("geo.away", { value });
  }
  const km = meters / 1000;
  const formatted =
    km >= 10 ? String(Math.round(km)) : km.toFixed(1);
  const value = i18n.t("geo.kilometers", { value: formatted });
  return style === "short" ? value : i18n.t("geo.away", { value });
}

export function formatLatLng(lat: number, lng: number): string {
  const latHem = lat >= 0 ? "N" : "S";
  const lngHem = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${latHem}, ${Math.abs(lng).toFixed(4)}° ${lngHem}`;
}

export function mapsUrlFor(lat: number, lng: number): string {
  const query = `${lat},${lng}`;
  const pin = i18n.t("geo.mapsPin");
  if (Platform.OS === "ios") {
    return `http://maps.apple.com/?ll=${query}&q=${encodeURIComponent(pin)}`;
  }
  if (Platform.OS === "android") {
    return `geo:${query}?q=${query}(${encodeURIComponent(pin)})`;
  }
  return `https://www.google.com/maps?q=${query}`;
}

export function googleMapsFallbackUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export type GeoPoint = {
  type: "Point";
  coordinates: [number, number];
};

export function isValidGeoPoint(
  location: GeoPoint | null | undefined,
): location is GeoPoint {
  if (!location || location.type !== "Point") return false;
  const coordinates = location.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2) return false;
  const lng = Number(coordinates[0]);
  const lat = Number(coordinates[1]);
  return (
    Number.isFinite(lng) &&
    Number.isFinite(lat) &&
    !(lng === 0 && lat === 0) &&
    lng >= -180 &&
    lng <= 180 &&
    lat >= -90 &&
    lat <= 90
  );
}

export function toGeoPoint(lng: number, lat: number): GeoPoint {
  const longitude = Number(lng);
  const latitude = Number(lat);
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
    throw new Error("Location coordinates must be finite numbers");
  }
  return {
    type: "Point",
    coordinates: [longitude, latitude],
  };
}

export async function openMapsAt(lat: number, lng: number): Promise<void> {
  const url = mapsUrlFor(lat, lng);
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
      return;
    }
  } catch {
    // Fall through to the HTTPS maps URL.
  }
  await Linking.openURL(googleMapsFallbackUrl(lat, lng));
}
