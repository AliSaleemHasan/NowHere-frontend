const React = require("react");

const MapView = (props) =>
  React.createElement("View", {
    testID: "react-native-maps-map-view",
    ...props,
  });
const Marker = (props) =>
  React.createElement("View", {
    testID: "react-native-maps-marker",
    ...props,
  });

module.exports = {
  __esModule: true,
  default: MapView,
  Marker,
};
