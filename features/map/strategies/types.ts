import { StyleProp, ViewStyle } from "react-native";

export type MapCoordinate = {
  latitude: number;
  longitude: number;
};

export type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
};

export type UnifiedMarkerProps = {
  id: string;
  coordinate: MapCoordinate;
  title?: string;
  pinColor?: string;
  onPress?: () => void;
};
export type UnifiedMapViewProps = {
  region: MapRegion;
  showUserLocation?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export interface IMapStrategy {
  readonly id: string;
  readonly name: string;
  renderMap(props: UnifiedMapViewProps): React.ReactElement;
  renderMarker(props: UnifiedMarkerProps): React.ReactElement;
}
