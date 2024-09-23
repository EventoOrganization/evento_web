// src/store/useInterestStore.ts
import { InterestType } from "@/types/EventType";
import { fetchData } from "@/utils/fetchData";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface InterestStoreState {
  interests: InterestType[];
  setInterests: (interests: InterestType[]) => void;
  loadInterests: () => Promise<void>;
}

const customStorage = {
  getItem: (name: string) => {
    const item = sessionStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name: string, value: any) => {
    sessionStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    sessionStorage.removeItem(name);
  },
};

const useInterestStore = create<InterestStoreState>()(
  persist(
    (set, get) => ({
      interests: [],

      setInterests: (interests: InterestType[]) => set({ interests }),

      loadInterests: async () => {
        if (get().interests.length > 0) return;

        try {
          const interestRes = await fetchData("/users/getInterestsListing");
          if (interestRes && !interestRes.error) {
            set({ interests: interestRes.data as InterestType[] });
          } else {
            console.error(
              "Erreur lors du fetch des intérêts:",
              interestRes?.error,
            );
          }
        } catch (error) {
          console.error("Erreur lors du fetch des intérêts:", error);
        }
      },
    }),
    {
      name: "interest-store", // Clé unique pour sessionStorage
      storage: customStorage, // Stockage dans sessionStorage
    },
  ),
);

export { useInterestStore };
