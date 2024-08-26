// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";
type User = {
  _id: string;
  name: string;
  email: string;
  countryCode?: string;
  createdAt?: string;
  updatedAt?: string;
  // token: string;
  profileImage?: string;
  eventsAttended?: number;
  following?: number;
  upcomingEvents?: Array<{ title: string }>;
  filteredUpcomingEventsAttened?: Array<{ title: string }>;
  filteredPastEventsAttended?: Array<{ title: string }>;
  pastEvents?: Array<{ title: string }>;
};

type AuthState = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};
// Création d'un adaptateur pour le localStorage
const zustandLocalStorage: PersistStorage<AuthState> = {
  getItem: (name) => {
    const storedValue = localStorage.getItem(name);
    if (storedValue) {
      return JSON.parse(storedValue);
    }
    return null;
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
      storage: zustandLocalStorage,
    },
  ),
);
