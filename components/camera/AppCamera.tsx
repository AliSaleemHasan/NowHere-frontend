import React, { useRef, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from "react-native";
import {
  CameraType,
  CameraView,
  FlashMode,
  useCameraPermissions,
} from "expo-camera";
import { cssInterop } from "nativewind";
import { CameraPermissionView } from "./CameraPermissionView";
import { CameraTopControls } from "./CameraTopControls";
import { CameraShutterButton } from "./CameraShutterButton";

cssInterop(CameraView, { className: "style" });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  camera: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface AppCameraProps {
  onCapture: (uri: string) => void | Promise<void>;
  onClose?: () => void;
  initialFacing?: CameraType;
  initialFlash?: FlashMode;
  quality?: number;
  topControls?: React.ReactNode;
  bottomControls?: React.ReactNode;
  leftBottomControl?: React.ReactNode;
  rightBottomControl?: React.ReactNode;
  overlay?: React.ReactNode;
  showFlipControl?: boolean;
  showFlashControl?: boolean;
  showCloseControl?: boolean;
  shutterDisabled?: boolean;
}

export const AppCamera: React.FC<AppCameraProps> = ({
  onCapture,
  onClose,
  initialFacing = "back",
  initialFlash = "off",
  quality = 0.85,
  topControls,
  bottomControls,
  leftBottomControl,
  rightBottomControl,
  overlay,
  showFlipControl = true,
  showFlashControl = true,
  showCloseControl = true,
  shutterDisabled = false,
}) => {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>(initialFacing);
  const [flash, setFlash] = useState<FlashMode>(initialFlash);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlash((current) => {
      if (current === "off") return "on";
      if (current === "on") return "auto";
      return "off";
    });
  };

  const handleTakeShutter = async () => {
    if (!cameraRef.current || isCapturing || shutterDisabled) return;

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality,
        skipProcessing: false,
      });

      if (photo?.uri) {
        await onCapture(photo.uri);
      }
    } catch (err) {
      console.error("Failed to capture photo:", err);
    } finally {
      setIsCapturing(false);
    }
  };

  let insetsBottom = 0;
  try {
    const insets = useSafeAreaInsets();
    insetsBottom = insets.bottom;
  } catch {
    insetsBottom = 0;
  }

  const bottomPadding = Math.max(insetsBottom, 20);

  // 1. Loading permission state
  if (!permission) {
    return (
      <View
        testID="camera-loading-indicator"
        className="flex-1 bg-black items-center justify-center"
      >
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  // 2. Permission Denied state
  if (!permission.granted) {
    return (
      <CameraPermissionView
        onRequestPermission={requestPermission}
        onClose={onClose}
      />
    );
  }

  // 3. Live In-App Camera state
  return (
    <View style={styles.container} className="flex-1 bg-black">
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        className="flex-1 w-full h-full"
        facing={facing}
        flash={flash}
        animateShutter
      >
        <SafeAreaView className="flex-1 justify-between">
          {/* Top Controls Bar */}
          <CameraTopControls
            onClose={onClose}
            showCloseControl={showCloseControl}
            flash={flash}
            showFlashControl={showFlashControl}
            onToggleFlash={toggleFlash}
            showFlipControl={showFlipControl}
            onToggleFlip={toggleCameraFacing}
            topControls={topControls}
          />

          {/* Custom Overlay */}
          {overlay}

          {/* Bottom Controls Bar */}
          <View
            style={{ paddingBottom: bottomPadding }}
            className="px-6 pt-4 bg-gradient-to-t from-black/80 to-transparent"
          >
            {bottomControls ? (
              bottomControls
            ) : (
              <View className="flex-row items-center justify-between w-full">
                <View className="w-16 items-start">{leftBottomControl}</View>
                <CameraShutterButton
                  onPress={handleTakeShutter}
                  isCapturing={isCapturing}
                  disabled={shutterDisabled}
                />
                <View className="w-16 items-end">{rightBottomControl}</View>
              </View>
            )}
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
};

export default AppCamera;

