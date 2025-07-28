import {
  getCurrentPositionAsync,
  PermissionStatus,
  requestForegroundPermissionsAsync,
} from "expo-location";
import { Alert, Linking } from "react-native";

export const getLocationPermission = async (): Promise<any> => {
  let { status, canAskAgain } = await requestForegroundPermissionsAsync();

  if (status !== PermissionStatus.GRANTED) {
    // ✋ If we can’t ask again, guide user to Settings:
    if (!canAskAgain) {
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
    return { error: "Location permission not granted" };
  }

  // 4) Finally, actually fetch the location
  try {
    const { coords } = await getCurrentPositionAsync();
    return { coords };
  } catch {
    return { error: "Could not get current location" };
  }
};
