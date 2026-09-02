import React from "react";
import { TouchableOpacity, View } from "react-native";

export interface CameraShutterButtonProps {
  onPress: () => void | Promise<void>;
  isCapturing?: boolean;
  disabled?: boolean;
}

export const CameraShutterButton: React.FC<CameraShutterButtonProps> = ({
  onPress,
  isCapturing = false,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      testID="camera-shutter-button"
      onPress={onPress}
      disabled={isCapturing || disabled}
      className="w-20 h-20 rounded-full border-4 border-white items-center justify-center p-1"
    >
      <View
        className={`w-full h-full rounded-full ${
          isCapturing ? "bg-red-500 scale-90" : "bg-white"
        }`}
      />
    </TouchableOpacity>
  );
};

export default CameraShutterButton;
