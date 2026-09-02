import { mmkvStorage } from "@/lib/storage";
import { UserResponse } from "@/types/api";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserState {
  user: UserResponse | null;
  setUser: (user: UserResponse) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-profile-storage",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);

export const setUser = (user: UserResponse) =>
  useUserStore.getState().setUser(user);
export const clearUser = () => useUserStore.getState().clearUser();
