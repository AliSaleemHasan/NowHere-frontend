import React from "react";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export interface CameraPermissionViewProps {
  onRequestPermission: () => void | Promise<any>;
  onClose?: () => void;
}

export const CameraPermissionView: React.FC<CameraPermissionViewProps> = ({
  onRequestPermission,
  onClose,
}) => {
  return (
    <SafeAreaView className="flex-1 bg-black items-center justify-center px-6">
      <FontAwesome name="camera" size={54} color="#666" />
      <Text className="text-white text-lg font-bold text-center mt-4">
        Camera Permission Needed
      </Text>
      <Text className="text-gray-400 text-sm text-center mt-2 mb-6">
        NowHere needs access to your camera to take and post snaps.
      </Text>
      <TouchableOpacity
        testID="camera-grant-permission-button"
        onPress={onRequestPermission}
        className="bg-white px-6 py-3 rounded-full"
      >
        <Text className="text-black font-semibold">Allow Camera</Text>
      </TouchableOpacity>
      {onClose && (
        <TouchableOpacity
          testID="camera-permission-cancel-button"
          onPress={onClose}
          className="mt-4 px-6 py-2"
        >
          <Text className="text-gray-400 text-sm">Cancel</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default CameraPermissionView;
