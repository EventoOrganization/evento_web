import { InterestType } from "@/types/EventType";
import { fetchData } from "@/utils/fetchData";
import { handleError } from "@/utils/handleError";
import { handleLog } from "@/utils/handleLog";
import { handleWarning } from "@/utils/handleWarning";
import { StateCreator } from "zustand";

export interface InterestSlice {
  interests: InterestType[];
  loadInterests: () => Promise<void>;
  refreshInterests: () => Promise<void>;
  setInterests: (interests: InterestType[]) => void;
}

export const createInterestSlice: StateCreator<InterestSlice> = (set, get) => ({
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

        if (JSON.stringify(currentInterests) !== JSON.stringify(newInterests)) {
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
});
