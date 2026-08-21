const React = require("react");

const MapView = (props) =>
  React.createElement("View", { testID: "maplibre-map-view", ...props });
const Camera = (props) =>
  React.createElement("View", { testID: "maplibre-camera", ...props });
const PointAnnotation = (props) =>
  React.createElement("View", {
    testID: "maplibre-point-annotation",
    ...props,
  });
const UserLocation = (props) =>
  React.createElement("View", { testID: "maplibre-user-location", ...props });

module.exports = {
  __esModule: true,
  default: {
    MapView,
    Camera,
    PointAnnotation,
    UserLocation,
    StyleURL: {
      Street: "https://tiles.openfreemap.org/styles/liberty",
    },
    setAccessToken: jest.fn(),
  },
  MapView,
  Camera,
  PointAnnotation,
  UserLocation,
  StyleURL: {
    Street: "https://tiles.openfreemap.org/styles/liberty",
  },
  setAccessToken: jest.fn(),
};
