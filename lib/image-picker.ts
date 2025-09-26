// asking for permession

import * as ImagePicker from "expo-image-picker";
import { Alert, Linking } from "react-native";
export const askCameraPermession = async () => {
  const permissionStatus = await ImagePicker.requestCameraPermissionsAsync();

  // ask again by prompting
  if (!permissionStatus.granted)
    Alert.alert(
      "Camera Permission",
      "Please make sure to enable camera permission to continue .",
      [
        { text: "Open Settings", onPress: () => Linking.openSettings() },
        { text: "Cancel", style: "destructive" },
      ]
    );
};

export const handleCameraCapture = async () => {
  const cameraPermission = await ImagePicker.getCameraPermissionsAsync();

  if (!cameraPermission.granted) await askCameraPermession();

  // TODO: test rejecting permission in both cases (what will happen?)

  // asumming of getting the permission
  return await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    allowsMultipleSelection: true,
    mediaTypes: ["images"],
    quality: 0.4,
    base64: false,
  });
};
