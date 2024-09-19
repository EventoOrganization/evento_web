// src/store/useProfileStore.ts
import { EventType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { create } from "zustand"; // Utilisation de l'import nommé
import { persist } from "zustand/middleware";

interface ProfileStoreState {
  userInfo: UserType | null;
  upcomingEvents: EventType[];
  pastEvents: EventType[];
  hostedEvents: EventType[];
  filteredPastEventsAttended: EventType[];
  filteredUpcomingEventsAttened: EventType[];
  setProfileData: (data: Partial<ProfileStoreState>) => void;
}
const customStorage = {
  getItem: (name: string) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name: string, value: any) => {
    sessionStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    sessionStorage.removeItem(name);
  },
};

const useProfileStore = create<ProfileStoreState>()(
  persist(
    (set) => ({
      userInfo: null,
      upcomingEvents: [],
      pastEvents: [],
      hostedEvents: [],
      filteredPastEventsAttended: [],
      filteredUpcomingEventsAttened: [],
      setProfileData: (data) => set(data),
    }),
    {
      name: "profile-store",
      storage: customStorage,
    },
  ),
);

export { useProfileStore };
