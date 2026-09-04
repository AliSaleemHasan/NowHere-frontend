import { i18n } from "@/lib/i18n";
import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import { I18nextProvider } from "react-i18next";
import { Text } from "react-native";
import * as ExpoCamera from "expo-camera";
import { AppCamera } from "../AppCamera";

function renderCamera(ui: React.ReactElement) {
  return render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);
}

const expoCameraMock = ExpoCamera as typeof ExpoCamera & {
  __setMockPermission: (permission: unknown) => void;
  __mockTakePictureAsync: jest.Mock;
  __mockRequestPermission: jest.Mock;
};

describe("AppCamera Component", () => {
  const onCaptureMock = jest.fn();
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    expoCameraMock.__setMockPermission({ granted: true, canAskAgain: true, status: "granted" });
    expoCameraMock.__mockTakePictureAsync.mockResolvedValue({
      uri: "file:///mock/captured_snap.jpg",
      width: 1080,
      height: 1920,
    });
  });

  describe("Permission Handling", () => {
    test("renders loading indicator when permission is undetermined", () => {
      expoCameraMock.__setMockPermission(null);

      const { getByTestId } = renderCamera(
        <AppCamera onCapture={onCaptureMock} onClose={onCloseMock} />
      );

      expect(getByTestId("camera-loading-indicator")).toBeTruthy();
    });

    test("renders permission request screen when permission is not granted", () => {
      expoCameraMock.__setMockPermission({ granted: false, canAskAgain: true, status: "denied" });

      const { getByText, getByTestId } = renderCamera(
        <AppCamera onCapture={onCaptureMock} onClose={onCloseMock} />
      );

      expect(getByText("Camera Permission Needed")).toBeTruthy();
      expect(getByTestId("camera-grant-permission-button")).toBeTruthy();
    });

    test("calls requestPermission when allow camera button is pressed", async () => {
      expoCameraMock.__setMockPermission({ granted: false, canAskAgain: true, status: "denied" });

      const { getByTestId } = renderCamera(
        <AppCamera onCapture={onCaptureMock} onClose={onCloseMock} />
      );

      fireEvent.press(getByTestId("camera-grant-permission-button"));
      expect(expoCameraMock.__mockRequestPermission).toHaveBeenCalled();
    });

    test("calls onClose when cancel is pressed on permission screen", () => {
      expoCameraMock.__setMockPermission({ granted: false, canAskAgain: true, status: "denied" });

      const { getByTestId } = renderCamera(
        <AppCamera onCapture={onCaptureMock} onClose={onCloseMock} />
      );

      fireEvent.press(getByTestId("camera-permission-cancel-button"));
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("Camera Controls & Operation", () => {
    test("renders CameraView with default facing and flash props", () => {
      const { getByTestId } = renderCamera(
        <AppCamera onCapture={onCaptureMock} onClose={onCloseMock} />
      );

      const cameraView = getByTestId("expo-camera-view");
      expect(cameraView).toBeTruthy();
      expect(cameraView.props.facing).toBe("back");
      expect(cameraView.props.flash).toBe("off");
    });

    test("toggles camera facing between back and front", () => {
      const { getByTestId } = renderCamera(
        <AppCamera onCapture={onCaptureMock} onClose={onCloseMock} />
      );

      const flipButton = getByTestId("camera-flip-button");
      const cameraView = getByTestId("expo-camera-view");

      expect(cameraView.props.facing).toBe("back");

      fireEvent.press(flipButton);
      expect(getByTestId("expo-camera-view").props.facing).toBe("front");

      fireEvent.press(flipButton);
      expect(getByTestId("expo-camera-view").props.facing).toBe("back");
    });

    test("cycles flash mode between off, on, and auto", () => {
      const { getByTestId } = renderCamera(
        <AppCamera onCapture={onCaptureMock} onClose={onCloseMock} />
      );

      const flashButton = getByTestId("camera-flash-button");

      expect(getByTestId("expo-camera-view").props.flash).toBe("off");

      fireEvent.press(flashButton);
      expect(getByTestId("expo-camera-view").props.flash).toBe("on");

      fireEvent.press(flashButton);
      expect(getByTestId("expo-camera-view").props.flash).toBe("auto");

      fireEvent.press(flashButton);
      expect(getByTestId("expo-camera-view").props.flash).toBe("off");
    });

    test("calls onClose when close button is pressed", () => {
      const { getByTestId } = renderCamera(
        <AppCamera onCapture={onCaptureMock} onClose={onCloseMock} />
      );

      const closeButton = getByTestId("camera-close-button");
      fireEvent.press(closeButton);
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    test("captures photo on shutter press and invokes onCapture callback", async () => {
      const { getByTestId } = renderCamera(
        <AppCamera onCapture={onCaptureMock} onClose={onCloseMock} />
      );

      const shutterButton = getByTestId("camera-shutter-button");

      await act(async () => {
        fireEvent.press(shutterButton);
      });

      expect(expoCameraMock.__mockTakePictureAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          quality: 0.85,
        })
      );
      expect(onCaptureMock).toHaveBeenCalledWith("file:///mock/captured_snap.jpg");
    });

    test("renders custom topControls and bottomControls when provided", () => {
      const { getByText } = renderCamera(
        <AppCamera
          onCapture={onCaptureMock}
          onClose={onCloseMock}
          topControls={<Text>Custom Top Bar</Text>}
          bottomControls={<Text>Custom Bottom Bar</Text>}
        />
      );

      expect(getByText("Custom Top Bar")).toBeTruthy();
      expect(getByText("Custom Bottom Bar")).toBeTruthy();
    });
  });
});
