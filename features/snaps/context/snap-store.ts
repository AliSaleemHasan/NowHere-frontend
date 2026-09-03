import { MAX_SNAP_IMAGES } from "@/lib/image-upload";
import { mmkvStorage } from "@/lib/storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SnapStoreState = {
  snaps: string[];
  addSnap: (uri: string) => void;
  removeSnap: (uri: string) => void;
  clearSnaps: () => void;
};

function cleanUris(uris: string[]): string[] {
  return uris.filter((uri) => typeof uri === "string" && uri.length > 0);
}

export const useSnapDraft = create<SnapStoreState>()(
  persist(
    (set, get) => ({
      snaps: [],
      addSnap: (uri: string) => {
        if (!uri) return;
        const current = cleanUris(get().snaps);
        if (current.includes(uri) || current.length >= MAX_SNAP_IMAGES) return;
        set({ snaps: [...current, uri] });
      },
      removeSnap: (id: string) =>
        set(() => ({ snaps: cleanUris(get().snaps).filter((snap) => snap !== id) })),
      clearSnaps: () => set(() => ({ snaps: [] })),
    }),
    {
      name: "snaps",
      storage: createJSONStorage(() => mmkvStorage),
      merge: (persisted, current) => {
        const stored = (persisted ?? {}) as Partial<SnapStoreState>;
        return {
          ...current,
          ...stored,
          snaps: cleanUris(stored.snaps ?? []),
        };
      },
    },
  ),
);
