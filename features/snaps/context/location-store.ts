import { getUserLocation } from "@/lib/location";
import {
  getItemAsync as getItem,
  deleteItemAsync as removeItem,
  setItemAsync as setItem,
} from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SnapLocation } from "../types/snaps-api-type";
type UserLocationState = {
  location: SnapLocation;
  error?: string;
  loading?: boolean;
  boarding: boolean;
  featchLocation: () => Promise<void>;
  setBoarding: () => void;
  setLocation: (newLocation: SnapLocation) => void;
};

export const useLocation = create<UserLocationState>()(
  persist(
    (set, get) => ({
      loading: false,
      boarding: false,
      location: {
        type: "Point",
        coordinates: [0, 0],
      },
      setBoarding: () => {
        set(() => ({ boarding: true }));
      },
      async featchLocation() {
        set(() => ({ loading: true }));
        try {
          const results = await getUserLocation();

          if (!results.success)
            set(() => ({ error: results.message, loading: false }));
          else
            set(() => ({
              location: results.data,
              error: "",
              loading: false,
              boarding: true,
            }));
        } catch (err) {
          set((state) => ({ error: JSON.stringify(err), loading: false })); //TODO: Better Error Handling
        } finally {
          set(() => ({ loading: false }));
        }
      },
      setLocation: (
        newLocation // TODO: make sure to emit userLocation event
      ) =>
        set(() => ({
          location: newLocation,
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
        location: state.location,
        boarding: state.boarding,
      }),
    }
  )
);
