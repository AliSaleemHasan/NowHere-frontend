import React from "react";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export interface CameraPermissionViewProps {
  onRequestPermission: () => void | Promise<unknown>;
  onClose?: () => void;
}

export const CameraPermissionView: React.FC<CameraPermissionViewProps> = ({
  onRequestPermission,
  onClose,
}) => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-black px-6">
      <FontAwesome name="camera" size={54} color="#666" />
      <Text className="mt-4 text-center text-lg font-bold text-white">
        Camera Permission Needed
      </Text>
      <Text className="mb-6 mt-2 text-center text-sm text-gray-400">
        NowHere needs access to your camera to take and post snaps.
      </Text>
      <TouchableOpacity
        testID="camera-grant-permission-button"
        onPress={() => {
          void onRequestPermission();
        }}
        className="rounded-full bg-white px-6 py-3"
      >
        <Text className="font-semibold text-black">Allow Camera</Text>
      </TouchableOpacity>
      {onClose && (
        <TouchableOpacity
          testID="camera-permission-cancel-button"
          onPress={onClose}
          className="mt-4 px-6 py-2"
        >
          <Text className="text-sm text-gray-400">Cancel</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default CameraPermissionView;
