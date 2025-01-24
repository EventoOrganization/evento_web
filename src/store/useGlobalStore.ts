import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createEventSlice, EventSlice } from "./slices/eventSlice";
import { createInterestSlice, InterestSlice } from "./slices/interestSlice";
import { createProfileSlice, ProfileSlice } from "./slices/profileSlice";
import { createUserSlice, UserSlice } from "./slices/userSlice";

type GlobalStoreState = ProfileSlice & EventSlice & InterestSlice & UserSlice;

const isLocalStorageAvailable = () => {
  try {
    const testKey = "test";
    localStorage.setItem(testKey, "testValue");
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

const localStorageCustom = {
  getItem: (name: string) => {
    if (isLocalStorageAvailable()) {
      const item = localStorage.getItem(name);
      return item ? JSON.parse(item) : null;
    }
    return null;
  },
  setItem: (name: string, value: any) => {
    if (isLocalStorageAvailable()) {
      localStorage.setItem(name, JSON.stringify(value));
    }
  },
  removeItem: (name: string) => {
    if (isLocalStorageAvailable()) {
      localStorage.removeItem(name);
    }
  },
};

export const useGlobalStore = create<GlobalStoreState>()(
  persist(
    (set, get, api) => ({
      ...createProfileSlice(set, get, api),
      ...createEventSlice(set, get, api),
      ...createInterestSlice(set, get, api),
      ...createUserSlice(set, get, api),
    }),
    {
      name: "global-store",
      storage: isLocalStorageAvailable() ? localStorageCustom : undefined,
    },
  ),
);
