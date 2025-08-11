import { getUserLocation } from "@/lib/location";
import {
  getItemAsync as getItem,
  deleteItemAsync as removeItem,
  setItemAsync as setItem,
} from "expo-secure-store";
import { LatLng } from "react-native-maps";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SnapLocation } from "../types/snaps-api-type";
type UserLocationState = {
  location: SnapLocation;
  error?: string;
  loading?: boolean;
  featchLocation: () => Promise<void>;
  setLocation: (newLocation: LatLng) => void;
};

export const useLocation = create<UserLocationState>()(
  persist(
    (set, get) => ({
      loading: true,
      location: {
        type: "Point",
        coordinates: [0, 0],
      },
      async featchLocation() {
        set(() => ({ loading: true }));
        try {
          const results = await getUserLocation();
          if (!results.success) set(() => ({ error: results.message }));
          else set(() => ({ location: results.data, error: "" }));
        } catch (err) {
          set((state) => ({ error: JSON.stringify(err) })); //TODO: Better Error Handling
        } finally {
          set(() => ({ loading: false }));
        }
      },
      setLocation: (
        newLocation // TODO: make sure to emit userLocation event
      ) =>
        set(() => ({
          location: {
            coordinates: [newLocation.longitude, newLocation.latitude],
            type: "Point",
          },
        })),
    }),
    {
      name: "location",
      storage: createJSONStorage(() => ({
        getItem,
        removeItem,
        setItem,
      })),
      partialize: (state) => ({
        location,
      }),
    }
  )
);
