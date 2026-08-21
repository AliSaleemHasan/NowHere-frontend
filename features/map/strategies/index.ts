import { MapLibreStrategy } from "./MapLibreStrategy";

// Developers configure the active map strategy here:
export const activeMapStrategy = new MapLibreStrategy();

export * from "./types";
export * from "./MapLibreStrategy";
export * from "./ReactNativeMapsStrategy";
