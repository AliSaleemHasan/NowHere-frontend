import { LoginFormProps } from "@/features/auth/types/auth-api.types";
import { LocationObjectCoords } from "expo-location";

// ********************************************************************
//                          USER CONTEXT
// ********************************************************************

export type UserLocationState = {
  coords?: LocationObjectCoords;
  error?: string;
  isLoading: boolean; // Added loading state
};

export type UserLocationAction =
  | { type: "SET_LOCATION"; payload: LocationObjectCoords }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };

export type UserLocationContextValue = {
  state: UserLocationState;
  fetchLocation: () => Promise<void>; // More descriptive than dispatch
};

// ********************************************************************
//                          Auth CONTEXT
// ********************************************************************

export type AuthContextState = {
  loggedIn: boolean;
  isReady: boolean;
  login: (inputs: LoginFormProps) => void;
  logout: () => void;
};
