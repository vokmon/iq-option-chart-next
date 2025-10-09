import { create } from "zustand";
import { User } from "@/types/user";

interface UserState {
  user?: User;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: undefined }),
}));
