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
      ],
    );
};

export const handleCameraCapture = async (
  options?: ImagePicker.ImagePickerOptions,
) => {
  const cameraPermission = await ImagePicker.getCameraPermissionsAsync();

  if (!cameraPermission.granted) await askCameraPermession();

  // quality: 1 activates Expo's RawImageExporter, skipping the slow native bitmap decompression & re-encoding loop
  return await ImagePicker.launchCameraAsync({
    allowsEditing: false,
    mediaTypes: ["images"],
    quality: 1,
    exif: false,
    base64: false,
    ...options,
  });
};
