import { mmkvStorage } from "@/lib/storage";
import { UserProfile } from "@/types/api";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserState {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  patchUser: (user: Partial<UserProfile>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      patchUser: (partial) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, ...partial }
            : partial.id && partial.email
              ? {
                  id: partial.id,
                  email: partial.email,
                  ...partial,
                }
              : state.user,
        })),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-profile-storage",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);

export const setUser = (user: UserProfile) =>
  useUserStore.getState().setUser(user);
export const patchUser = (user: Partial<UserProfile>) =>
  useUserStore.getState().patchUser(user);
export const clearUser = () => useUserStore.getState().clearUser();
