import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-black px-6">
      <FontAwesome name="camera" size={54} color="#666" />
      <Text className="mt-4 text-center text-lg font-bold text-white">
        {t("camera.permissionTitle")}
      </Text>
      <Text className="mb-6 mt-2 text-center text-sm text-gray-400">
        {t("camera.permissionBody")}
      </Text>
      <TouchableOpacity
        testID="camera-grant-permission-button"
        onPress={() => {
          void onRequestPermission();
        }}
        className="rounded-full bg-white px-6 py-3"
      >
        <Text className="font-semibold text-black">{t("camera.allow")}</Text>
      </TouchableOpacity>
      {onClose && (
        <TouchableOpacity
          testID="camera-permission-cancel-button"
          onPress={onClose}
          className="mt-4 px-6 py-2"
        >
          <Text className="text-sm text-gray-400">
            {t("snaps.actions.cancel")}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default CameraPermissionView;
