import { Linking, Platform } from "react-native";
import {
  formatDistanceAway,
  formatLatLng,
  googleMapsFallbackUrl,
  haversineDistanceMeters,
  isValidGeoPoint,
  mapsUrlFor,
  openMapsAt,
  toGeoPoint,
} from "../geo";

describe("isValidGeoPoint", () => {
  it("rejects missing, zero, and out-of-range coordinates", () => {
    expect(isValidGeoPoint(undefined)).toBe(false);
    expect(isValidGeoPoint({ type: "Point", coordinates: [0, 0] })).toBe(false);
    expect(isValidGeoPoint({ type: "Point", coordinates: [200, 10] })).toBe(
      false,
    );
  });

  it("accepts a real GPS point", () => {
    expect(isValidGeoPoint({ type: "Point", coordinates: [13.4, 52.5] })).toBe(
      true,
    );
    expect(toGeoPoint(13.4, 52.5).coordinates).toEqual([13.4, 52.5]);
  });
});

describe("haversineDistanceMeters", () => {
  it("returns 0 for the same point", () => {
    expect(haversineDistanceMeters([13.4, 52.5], [13.4, 52.5])).toBe(0);
  });

  it("measures one degree of latitude as about 111 km", () => {
    const meters = haversineDistanceMeters([0, 0], [0, 1]);
    expect(meters).toBeGreaterThan(110_500);
    expect(meters).toBeLessThan(111_700);
  });
});

describe("formatDistanceAway", () => {
  it("uses nearby copy for GPS noise and missing values", () => {
    expect(formatDistanceAway(8)).toBe("Right here");
    expect(formatDistanceAway(Number.NaN)).toBe("Nearby");
  });

  it("formats meters and kilometers", () => {
    expect(formatDistanceAway(240)).toBe("240 m away");
    expect(formatDistanceAway(1500)).toBe("1.5 km away");
    expect(formatDistanceAway(12500)).toBe("13 km away");
  });
});

describe("formatLatLng", () => {
  it("renders hemisphere labels", () => {
    expect(formatLatLng(52.52, 13.405)).toBe("52.5200° N, 13.4050° E");
    expect(formatLatLng(-33.86, -151.21)).toBe("33.8600° S, 151.2100° W");
  });
});

describe("maps URLs", () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    Object.defineProperty(Platform, "OS", { value: originalOS });
    jest.restoreAllMocks();
  });

  it("builds a platform maps URL", () => {
    Object.defineProperty(Platform, "OS", { value: "ios" });
    expect(mapsUrlFor(52.5, 13.4)).toContain("52.5,13.4");
    expect(mapsUrlFor(52.5, 13.4)).toContain("maps.apple.com");

    Object.defineProperty(Platform, "OS", { value: "android" });
    expect(mapsUrlFor(52.5, 13.4)).toContain("geo:52.5,13.4");
  });

  it("falls back to Google Maps when the native URL cannot open", async () => {
    jest.spyOn(Linking, "canOpenURL").mockResolvedValue(false);
    const openURL = jest.spyOn(Linking, "openURL").mockResolvedValue(undefined as never);

    await openMapsAt(52.5, 13.4);

    expect(openURL).toHaveBeenCalledWith(googleMapsFallbackUrl(52.5, 13.4));
  });
});
