const React = require("react");

let mockPermission = { granted: true, canAskAgain: true, status: "granted" };
let mockRequestPermission = jest.fn().mockResolvedValue({ granted: true, status: "granted" });
let mockTakePictureAsync = jest.fn().mockResolvedValue({ uri: "file:///mock/photo.jpg", width: 1080, height: 1920 });

const CameraView = React.forwardRef((props, ref) => {
  React.useImperativeHandle(ref, () => ({
    takePictureAsync: mockTakePictureAsync,
  }));
  return React.createElement("View", { testID: "expo-camera-view", ...props }, props.children);
});

module.exports = {
  __esModule: true,
  CameraView,
  useCameraPermissions: () => [mockPermission, mockRequestPermission],
  __setMockPermission: (perm) => {
    mockPermission = perm;
  },
  __mockRequestPermission: mockRequestPermission,
  __mockTakePictureAsync: mockTakePictureAsync,
};
