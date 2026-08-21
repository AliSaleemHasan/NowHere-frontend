import React, { memo } from "react";
import { UnifiedMarkerProps, IMapStrategy } from "../strategies/types";
import { activeMapStrategy } from "../strategies";

export interface UnifiedMarkerComponentProps extends UnifiedMarkerProps {
  strategy?: IMapStrategy;
}

export const UnifiedMarker: React.FC<UnifiedMarkerComponentProps> = ({
  strategy = activeMapStrategy,
  ...markerProps
}) => {
  return strategy.renderMarker(markerProps);
};

export default memo(UnifiedMarker);
