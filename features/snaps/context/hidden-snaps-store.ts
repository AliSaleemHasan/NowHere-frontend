import { mmkvStorage } from "@/lib/storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

function cleanIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  const unique = new Set<string>();
  for (const id of ids) {
    if (typeof id === "string" && id.length > 0) unique.add(id);
  }
  return [...unique];
}

type HiddenSnapsState = {
  hiddenSnapIds: string[];
  hideSnap: (id: string) => void;
};

export const useHiddenSnaps = create<HiddenSnapsState>()(
  persist(
    (set, get) => ({
      hiddenSnapIds: [],
      hideSnap: (id: string) => {
        if (!id) return;
        const current = cleanIds(get().hiddenSnapIds);
        if (current.includes(id)) return;
        set({ hiddenSnapIds: [...current, id] });
      },
    }),
    {
      name: "hidden-snaps",
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({ hiddenSnapIds: state.hiddenSnapIds }),
      merge: (persisted, current) => {
        const stored = (persisted ?? {}) as Partial<HiddenSnapsState>;
        return {
          ...current,
          ...stored,
          hiddenSnapIds: cleanIds(stored.hiddenSnapIds),
        };
      },
    },
  ),
);
