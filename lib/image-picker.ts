// asking for permession

import * as ImagePicker from "expo-image-picker";
import { Alert, Linking } from "react-native";
export const askCameraPermession = async () => {
  const permissionStatus = await ImagePicker.getCameraPermissionsAsync();

  // ask again by prompting
  if (permissionStatus.status === ImagePicker.PermissionStatus.GRANTED)
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

  if (cameraPermission.status !== ImagePicker.PermissionStatus.GRANTED)
    await askCameraPermession();

  // TODO: test rejecting permission in both cases (what will happen?)

  // asumming of getting the permission
  return await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    allowsMultipleSelection: true,
    mediaTypes: ["livePhotos"],
    quality: 1,
  });
};
