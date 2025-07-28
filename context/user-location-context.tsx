import { getLocationPermission } from "@/lib/location";
import {
  UserLocationAction,
  UserLocationContextValue,
  UserLocationState,
} from "@/types/user-context.types";
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

export const UserLocationContext = createContext<UserLocationContextValue>(
  {} as UserLocationContextValue // Avoid null default
);

const initialState: UserLocationState = {
  isLoading: true,
  error: undefined,
  coords: undefined,
};

const reducer = (
  state: UserLocationState,
  action: UserLocationAction
): UserLocationState => {
  switch (action.type) {
    case "SET_LOCATION":
      return {
        ...state,
        coords: action.payload,
        error: undefined,
        isLoading: false,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const UserLocationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchLocation = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const result = await getLocationPermission();

      if (result.error) {
        dispatch({ type: "SET_ERROR", payload: result.error });
      } else if (result.coords) {
        dispatch({ type: "SET_LOCATION", payload: result.coords });
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Unexpected error occurred" });
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);
  return (
    <UserLocationContext.Provider value={{ state, fetchLocation }}>
      {children}
    </UserLocationContext.Provider>
  );
};

export default UserLocationProvider;

export const useUserLocation = () => useContext(UserLocationContext);
