import { getUserLocation } from "@/lib/location";
import { mmkvStorage } from "@/lib/storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { hasLocationConsent } from "../lib/location-consent";
import { SnapLocation } from "../types/snaps-api-type";

export { hasLocationConsent };

type UserLocationState = {
  location: SnapLocation;
  error?: string;
  loading?: boolean;
  boarding: boolean;
  locationConsentAt: string | null;
  fetchLocation: () => Promise<void>;
  setLocationConsent: (consented: boolean) => void;
  setLocation: (newLocation: SnapLocation) => void;
};

function readPersistedConsent(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return hasLocationConsent(value) ? value : null;
}

export const useLocation = create<UserLocationState>()(
  persist(
    (set, get) => ({
      loading: false,
      boarding: false,
      locationConsentAt: null,
      location: {
        type: "Point",
        coordinates: [0, 0],
      },
      setLocationConsent: (consented) => {
        set({
          locationConsentAt: consented ? new Date().toISOString() : null,
        });
      },
      async fetchLocation() {
        if (!hasLocationConsent(get().locationConsentAt)) {
          return;
        }
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
        locationConsentAt: state.locationConsentAt,
      }),
      merge: (persisted, current) => {
        const stored = (persisted ?? {}) as Partial<UserLocationState>;
        return {
          ...current,
          ...stored,
          locationConsentAt: readPersistedConsent(stored.locationConsentAt),
        };
      },
    },
  ),
);
