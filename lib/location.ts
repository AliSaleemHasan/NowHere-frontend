import { SnapLocation } from "@/features/snaps/types/snaps-api-type";
import { FetchResponse } from "@/types/api";
import {
  getCurrentPositionAsync,
  LocationAccuracy,
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
    const { coords } = await getCurrentPositionAsync({
      accuracy: LocationAccuracy.Low,
    });

    return {
      success: true,
      data: { type: "Point", coordinates: [coords.longitude, coords.latitude] },
    };
  } catch {
    return {
      message: "Could not get current location",
      success: false,
      error: "Location Error",
      statusCode: 403,
      path: "/UI",
    };
  }
};
