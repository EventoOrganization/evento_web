import { UserType } from "@/types/UserType";
import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";

export type AuthState = {
  user: UserType | null;
  setUser: (user: UserType) => void;
  clearUser: () => void;
};

const isServer = typeof window === "undefined";

const zustandLocalStorage: PersistStorage<AuthState> = {
  getItem: (name) => {
    if (isServer) {
      // console.log("getItem called on SSR");
    } else {
      // console.log("getItem called on Client");
    }

    const storedValue = localStorage.getItem(name);
    if (storedValue) {
      return JSON.parse(storedValue);
    }
    return null;
  },
  setItem: (name, value) => {
    if (isServer) {
      // console.log("setItem called on SSR");
    } else {
      // console.log("setItem called on Client");
    }

    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    if (isServer) {
      // console.log("removeItem called on SSR");
    } else {
      // console.log("removeItem called on Client");
    }

    localStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: UserType) => {
        // console.log("setUser called");
        set({ user });
      },
      clearUser: () => {
        // console.log("clearUser called");
        set({ user: null });
      },
    }),
    {
      name: "auth-storage",
      storage: isServer ? undefined : zustandLocalStorage,
    },
  ),
);
