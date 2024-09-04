// src/store/useProfileStore.ts
import { EventType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import create from "zustand";
import { persist } from "zustand/middleware";

interface ProfileStoreState {
  userInfo: UserType | null;
  upcomingEvents: EventType[];
  pastEvents: EventType[];
  following: number;
  totalEventAttended: number;
  filteredPastEventsAttended: EventType[];
  filteredUpcomingEventsAttened: EventType[];
  setProfileData: (data: Partial<ProfileStoreState>) => void;
}

export const useProfileStore = create(
  persist<ProfileStoreState>(
    (set) => ({
      userInfo: null,
      upcomingEvents: [],
      pastEvents: [],
      following: 0,
      totalEventAttended: 0,
      filteredPastEventsAttended: [],
      filteredUpcomingEventsAttened: [],
      setProfileData: (data) => set(data),
    }),
    {
      name: "profile-store", // unique name for the storage (localStorage key)
      getStorage: () => localStorage, // specify localStorage (default)
    },
  ),
);