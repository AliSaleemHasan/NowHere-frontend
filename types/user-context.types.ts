import { LocationObjectCoords } from "expo-location";

export type UserLocationState = {
  coords?: LocationObjectCoords;
  error?: string;
  isLoading: boolean; // Added loading state
};

export type UserLocationContextValue = {
  state: UserLocationState;
  fetchLocation: () => Promise<void>; // More descriptive than dispatch
};
