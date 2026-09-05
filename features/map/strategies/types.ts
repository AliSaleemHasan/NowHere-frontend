import type { ReactElement, ReactNode } from "react";
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
  tag?: string;
  badge?: string;
  onPress?: () => void;
};
export type UnifiedMapViewProps = {
  region: MapRegion;
  showUserLocation?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export interface IMapStrategy {
  readonly id: string;
  readonly name: string;
  renderMap(props: UnifiedMapViewProps): ReactElement;
  renderMarker(props: UnifiedMarkerProps): ReactElement;
}
