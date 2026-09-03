import { getUserLocation } from "@/lib/location";
import { mmkvStorage } from "@/lib/storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SnapLocation } from "../types/snaps-api-type";

type UserLocationState = {
  location: SnapLocation;
  error?: string;
  loading?: boolean;
  boarding: boolean;
  fetchLocation: () => Promise<void>;
  setBoarding: () => void;
  setLocation: (newLocation: SnapLocation) => void;
};

export const useLocation = create<UserLocationState>()(
  persist(
    (set) => ({
      loading: false,
      boarding: false,
      location: {
        type: "Point",
        coordinates: [0, 0],
      },
      setBoarding: () => {
        set(() => ({ boarding: true }));
      },
      async fetchLocation() {
        set(() => ({ loading: true }));
        try {
          const results = await getUserLocation();

          if (!results.success) {
            set(() => ({
              error: results.message || "Failed to get location",
              loading: false,
            }));
          } else {
            set(() => ({
              location: results.data,
              error: "",
              loading: false,
              boarding: true,
            }));
          }
        } catch (err) {
          set(() => ({
            error: err instanceof Error ? err.message : "Location error",
            loading: false,
          }));
        } finally {
          set(() => ({ loading: false }));
        }
      },
      setLocation: (newLocation) =>
        set(() => ({
          location: newLocation,
        })),
    }),
    {
      name: "location",
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        location: state.location,
        boarding: state.boarding,
      }),
    },
  ),
);
