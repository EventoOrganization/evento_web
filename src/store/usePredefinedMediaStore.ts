import { fetchData, HttpMethod } from "@/utils/fetchData";
import { handleError } from "@/utils/handleError";
import { handleLog } from "@/utils/handleLog";
import { handleWarning } from "@/utils/handleWarning";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PredefinedMediaState {
  predefinedMediaUrls: string[];
  loadPredefinedMedia: () => Promise<void>;
  refreshPredefinedMedia: () => Promise<void>;
  setPredefinedMedia: (urls: string[]) => void;
}

const isLocalStorageAvailable = () => {
  try {
    const testKey = "test";
    localStorage.setItem(testKey, "testValue");
    localStorage.removeItem(testKey);
    return true;
  } catch {
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

export const usePredefinedMediaStore = create<PredefinedMediaState>()(
  persist(
    (set, get) => ({
      predefinedMediaUrls: [],

      loadPredefinedMedia: async () => {
        try {
          handleLog("🖼️ Loading predefined media...");
          const res = await fetchData(
            "/api/fetchPredefinedMedia",
            HttpMethod.GET,
            null,
            null,
            process.env.NEXT_PUBLIC_FRONTEND_URL,
          );

          if (res.ok) {
            set({ predefinedMediaUrls: res.data as string[] });
            handleLog("✅ Predefined media loaded successfully!");
          } else {
            handleWarning({
              message: "⚠️ Failed to load predefined media",
              source: "loadPredefinedMedia",
              originalError: res.error,
            });
          }
        } catch (error) {
          handleError(error, "loadPredefinedMedia");
        }
      },

      refreshPredefinedMedia: async () => {
        try {
          handleLog("🔁 Refreshing predefined media...");
          const res = await fetchData(
            "/api/fetchPredefinedMedia",
            HttpMethod.GET,
            null,
            null,
            process.env.NEXT_PUBLIC_FRONTEND_URL,
          );

          if (res.ok) {
            const newMedia = res.data;
            const current = get().predefinedMediaUrls;
            if (JSON.stringify(current) !== JSON.stringify(newMedia)) {
              set({ predefinedMediaUrls: res.data as string[] });
              handleLog("✅ Predefined media refreshed.");
            }
          }
        } catch (error) {
          handleError(error, "refreshPredefinedMedia");
        }
      },

      setPredefinedMedia: (urls) => {
        handleLog("📝 Setting predefined media...");
        set({ predefinedMediaUrls: urls });
      },
    }),
    {
      name: "predefined-media-store",
      storage: isLocalStorageAvailable() ? localStorageCustom : undefined,
    },
  ),
);
