import React from "react";
import { Platform, StatusBar, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FlashMode } from "expo-camera";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface CameraTopControlsProps {
  onClose?: () => void;
  showCloseControl?: boolean;
  flash: FlashMode;
  showFlashControl?: boolean;
  onToggleFlash: () => void;
  showFlipControl?: boolean;
  onToggleFlip: () => void;
  topControls?: React.ReactNode;
}

export const CameraTopControls: React.FC<CameraTopControlsProps> = ({
  onClose,
  showCloseControl = true,
  flash,
  showFlashControl = true,
  onToggleFlash,
  showFlipControl = true,
  onToggleFlip,
  topControls,
}) => {
  let insetsTop = 0;
  try {
    const insets = useSafeAreaInsets();
    insetsTop = insets.top;
  } catch {
    insetsTop = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;
  }

  const topPadding = Math.max(insetsTop, 16);

  return (
    <View
      style={{ paddingTop: topPadding }}
      className="flex-row items-center justify-between px-5 pb-3"
    >
      {showCloseControl && onClose ? (
        <TouchableOpacity
          testID="camera-close-button"
          onPress={onClose}
          className="w-10 h-10 rounded-full bg-black/40 items-center justify-center"
        >
          <Ionicons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
      ) : (
        <View className="w-10 h-10" />
      )}

      {topControls}

      <View className="flex-row items-center gap-3">
        {showFlashControl && (
          <TouchableOpacity
            testID="camera-flash-button"
            onPress={onToggleFlash}
            className="w-10 h-10 rounded-full bg-black/40 items-center justify-center"
          >
            <Ionicons
              name={
                flash === "on"
                  ? "flash"
                  : flash === "auto"
                  ? "flash-outline"
                  : "flash-off"
              }
              size={20}
              color={flash === "off" ? "#ffffff" : "#ffeb3b"}
            />
          </TouchableOpacity>
        )}

        {showFlipControl && (
          <TouchableOpacity
            testID="camera-flip-button"
            onPress={onToggleFlip}
            className="w-10 h-10 rounded-full bg-black/40 items-center justify-center"
          >
            <Ionicons name="camera-reverse" size={22} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CameraTopControls;
