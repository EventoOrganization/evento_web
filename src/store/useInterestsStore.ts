import { InterestType } from "@/types/EventType";
import { fetchData } from "@/utils/fetchData";
import { handleError } from "@/utils/handleError";
import { handleLog } from "@/utils/handleLog";
import { handleWarning } from "@/utils/handleWarning";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface InterestState {
  interests: InterestType[];
  loadInterests: () => Promise<void>;
  refreshInterests: () => Promise<void>;
  setInterests: (interests: InterestType[]) => void;
}
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

export const useInterestsStore = create<InterestState>()(
  persist(
    (set, get) => ({
      interests: [],

      loadInterests: async () => {
        try {
          handleLog("🔄 Loading interests...");
          const res = await fetchData("/users/getInterestsListing");

          if (res.ok) {
            set({ interests: res.data as InterestType[] });
            handleLog("✅ Interests loaded successfully!");
          } else {
            handleWarning({
              message: "⚠️ Failed to load interests",
              source: "loadInterests",
              originalError: res.error,
            });
          }
        } catch (error) {
          handleError(error, "loadInterests");
        }
      },

      refreshInterests: async () => {
        try {
          handleLog("🔄 Refreshing interests...");
          const res = await fetchData("/users/getInterestsListing");

          if (res.ok) {
            const currentInterests = get().interests;
            const newInterests = res.data as InterestType[];

            if (
              JSON.stringify(currentInterests) !== JSON.stringify(newInterests)
            ) {
              set({ interests: newInterests });
              handleLog("✅ Interests refreshed successfully!");
            }
          } else {
            handleWarning({
              message: "⚠️ Failed to refresh interests",
              source: "refreshInterests",
              originalError: res.error,
            });
          }
        } catch (error) {
          handleError(error, "refreshInterests");
        }
      },

      setInterests: (interests) => {
        handleLog("📝 Setting interests...");
        set({ interests });
      },
    }),
    {
      name: "interests-store",
      storage: isLocalStorageAvailable() ? localStorageCustom : undefined,
    },
  ),
);
