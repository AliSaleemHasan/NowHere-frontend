import { SnapLocation } from "@/features/snaps/types/snaps-api-type";
import { FetchResponse } from "@/types/api";
import * as Location from "expo-location";
import {
  PermissionStatus,
  requestForegroundPermissionsAsync,
} from "expo-location";
import { Alert, Linking } from "react-native";

export const askLocationPermission = async () => {
  let { status, granted } = await requestForegroundPermissionsAsync();

  if (status !== PermissionStatus.GRANTED) {
    Alert.alert(
      "Location Permission",
      "You’ve denied location access. Please enable it in Settings to continue.",
      [
        {
          text: "Open Settings",
          onPress: () => Linking.openSettings(),
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  }

  return granted;
  // if user does'nt accept, it will not show anything until he accepts by clicking the shown button
};
export const getUserLocation = async (): Promise<
  FetchResponse<SnapLocation>
> => {
  try {
    if (!(await Location.hasServicesEnabledAsync())) {
      return {
        success: false,
        error: "LocationServicesDisabled",
        message: "Enable device location",
        statusCode: 412,
        path: "/UI",
      };
    }

    const perm = await Location.getForegroundPermissionsAsync();
    if (perm.status !== Location.PermissionStatus.GRANTED) {
      return {
        success: false,
        error: "PermissionDenied",
        message: "Foreground permission not granted",
        statusCode: 403,
        path: "/UI",
      };
    }

    let location = await Location.getLastKnownPositionAsync();
    if (!location) {
      location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        timeInterval: 5000,
      });
    }

    if (!location?.coords) throw new Error("No location");

    return {
      success: true,
      data: {
        type: "Point",
        coordinates: [location.coords.longitude, location.coords.latitude],
      },
    };
  } catch (e: any) {
    console.error("getUserLocation error:", e);
    return {
      success: false,
      error: "LocationError",
      message: e?.message || "Could not get current location",
      statusCode: 500,
      path: "/UI",
    };
  }
};
