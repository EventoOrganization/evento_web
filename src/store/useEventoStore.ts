// src/store/useEventoStore.ts
import { EventType, InterestType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { create } from "zustand"; // Utilisation de l'import nommé
import { persist } from "zustand/middleware";

interface EventoStoreState {
  interests: InterestType[];
  setInterests: (interests: InterestType[]) => void;
  loadInterests: () => Promise<void>;

  events: EventType[];
  setEvents: (events: EventType[]) => void;
  loadUpcomingEvents: (user?: UserType) => Promise<void>;

  users: UserType[];
  setUsers: (users: UserType[]) => void;
  loadUsersPlus: (userId: string, token: string) => Promise<void>;
}
const customStorage = {
  getItem: (name: string) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name: string, value: any) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};
const useEventoStore = create<EventoStoreState>()(
  persist(
    (set, get) => ({
      interests: [],
      events: [],
      users: [],

      // Setters
      setInterests: (interests: InterestType[]) => set({ interests }),
      setEvents: (events: EventType[]) => set({ events }),
      setUsers: (users: UserType[]) => set({ users }),

      // Load Interests
      loadInterests: async () => {
        if (get().interests.length > 0) return;

        try {
          const interestRes = await fetchData("/users/getInterestsListing");
          if (interestRes && !interestRes.error) {
            set({ interests: interestRes.data as InterestType[] });
          } else {
            console.error("Failed to fetch interests:", interestRes?.error);
          }
        } catch (error) {
          console.error("Error fetching interests:", error);
        }
      },
      // Load Upcoming Events
      loadUpcomingEvents: async (user) => {
        const userIdQuery = user && user._id ? `?userId=${user._id}` : "";
        try {
          const upcomingEventRes = await fetchData(
            `/events/getUpcomingEvents${userIdQuery}`,
          );
          if (upcomingEventRes && !upcomingEventRes.error) {
            set({ events: upcomingEventRes.data as EventType[] });
          } else {
            console.error("Failed to fetch events:", upcomingEventRes?.error);
          }
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      },
      loadUsersPlus: async (userId: string, token: string) => {
        // if (get().users.length > 0) return;
        try {
          const usersRes = await fetchData(
            `/users/followStatusForUsersYouFollow/${userId}`,
            HttpMethod.GET,
            null,
            token,
          );

          if (usersRes && !usersRes.error) {
            set({ users: usersRes.data as UserType[] });
          } else {
            console.error("Failed to fetch users:", usersRes?.error);
          }
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      },
    }),
    {
      name: "evento-store", // clé unique pour localStorage
      storage: customStorage, // Remplace getStorage par storage
    },
  ),
);

export { useEventoStore }; // Utilisation de l'export nommé
