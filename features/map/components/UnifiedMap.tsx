import React from "react";
import { UnifiedMapViewProps, IMapStrategy } from "../strategies/types";
import { activeMapStrategy } from "../strategies";

export interface UnifiedMapProps extends UnifiedMapViewProps {
  strategy?: IMapStrategy;
}

export const UnifiedMap: React.FC<UnifiedMapProps> = ({
  strategy = activeMapStrategy,
  ...mapProps
}) => {
  return strategy.renderMap(mapProps);
};

export default UnifiedMap;
