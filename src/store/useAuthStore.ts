import { UserType } from "@/types/UserType";
import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";

export type AuthState = {
  user: UserType | null;
  rememberMe: boolean;
  setUser: (user: UserType) => void;
  clearUser: () => void;
  toggleRememberMe: (remember: boolean) => void;
};

const isServer = typeof window === "undefined";

const zustandLocalStorage: PersistStorage<AuthState> = {
  getItem: (name) => {
    if (isServer) {
    } else {
    }
    const storedValue = localStorage.getItem(name);
    if (storedValue) {
      return JSON.parse(storedValue);
    }
    return null;
  },
  setItem: (name, value) => {
    if (isServer) {
    } else {
    }
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    if (isServer) {
    } else {
    }
    localStorage.removeItem(name);
  },
};
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      rememberMe: false,
      setUser: (user: UserType) => {
        console.log("Setting user in store:", user);
        set({ user });
      },
      clearUser: () => {
        set({ user: null });
      },
      toggleRememberMe: (remember: boolean) => {
        set({ rememberMe: remember });
      },
    }),
    {
      name: "auth-storage",
      storage: isServer ? undefined : zustandLocalStorage,
    },
  ),
);
