import { ApiError } from "@/lib/http/api-error";
import { i18n } from "@/lib/i18n";
import {
  isValidGeoPoint,
  toGeoPoint,
  type GeoPoint,
} from "@/lib/geo";
import {
  Accuracy,
  getCurrentPositionAsync,
  getForegroundPermissionsAsync,
  getLastKnownPositionAsync,
  PermissionStatus,
  requestForegroundPermissionsAsync,
} from "expo-location";
import { Alert, Linking } from "react-native";

export type LocationResult =
  | { success: true; data: GeoPoint }
  | { success: false; message: string };

export const askLocationPermission = async () => {
  const { status, granted } = await requestForegroundPermissionsAsync();

  if (status !== PermissionStatus.GRANTED) {
    Alert.alert(
      i18n.t("location.permissionTitle"),
      i18n.t("location.permissionBody"),
      [
        {
          text: i18n.t("location.openSettings"),
          onPress: () => Linking.openSettings(),
        },
        { text: i18n.t("location.cancel"), style: "cancel" },
      ],
    );
  }

  return granted;
};

export const getUserLocation = async (
  options: { fresh?: boolean } = {},
): Promise<LocationResult> => {
  try {
    const { status } = await getForegroundPermissionsAsync();

    if (status !== PermissionStatus.GRANTED) {
      return {
        success: false,
        message: "Location permission is required.",
      };
    }

    const currentPositionOptions = {
      accuracy: Accuracy.Balanced,
    };

    let location = options.fresh
      ? await getCurrentPositionAsync(currentPositionOptions)
      : (await getLastKnownPositionAsync({})) ??
        (await getCurrentPositionAsync(currentPositionOptions));

    if (!location) {
      return {
        success: false,
        message: "Could not get current location",
      };
    }

    const point = toGeoPoint(
      location.coords.longitude,
      location.coords.latitude,
    );
    if (!isValidGeoPoint(point)) {
      return {
        success: false,
        message: "Could not get a valid GPS location",
      };
    }

    return {
      success: true,
      data: point,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Could not get current location";
    return {
      success: false,
      message,
    };
  }
};

export async function requireSnapLocation(): Promise<GeoPoint> {
  const fresh = await getUserLocation({ fresh: true });
  if (fresh.success && isValidGeoPoint(fresh.data)) {
    return fresh.data;
  }

  const lastKnown = await getUserLocation({ fresh: false });
  if (lastKnown.success && isValidGeoPoint(lastKnown.data)) {
    return lastKnown.data;
  }

  throw new ApiError(
    (!fresh.success ? fresh.message : undefined) ||
      "Location is required to share a snap. Enable GPS and try again.",
    400,
  );
}
