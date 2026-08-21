import { mmkvStorage } from "@/lib/storage";
import { AddSnapRequest } from "@/types/api";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
type SnapStoreState = AddSnapRequest & {
  addSnap: (uri: string) => void;
  removeSnap: (id: string) => void;
  clearSnaps: () => void;
  addDescription: (description: string) => void;
};
export const useSnap = create<SnapStoreState>()(
  persist(
    (set, get) => ({
      description: "",
      snaps: [""],
      addDescription: (description: string) => set(() => ({ description })),
      addSnap: (uri: string) =>
        set((state) => ({ snaps: [...state.snaps, uri] })),
      removeSnap: (id: string) =>
        set((state) => ({ snaps: get().snaps.filter((snap) => snap != id) })),
      clearSnaps: () => set(() => ({ snaps: [], description: "" })),
    }),
    {
      name: "snaps",
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
