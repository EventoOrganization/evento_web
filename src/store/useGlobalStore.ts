import { EventType, InterestType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GlobalStoreState {
  userInfo: UserType | null;
  interests: InterestType[];
  events: EventType[];
  users: UserType[];
  // Setters

  setProfileData: (data: Partial<GlobalStoreState>) => void;
  updateFollowingUserIds: (
    userId: string,
    action: "follow" | "unfollow",
  ) => void;
  setInterests: (interests: InterestType[]) => void;
  setEvents: (events: EventType[]) => void;
  setUsers: (users: UserType[]) => void;
  updateUser: (updateUser: Partial<UserType>) => void;
  addEvent: (newEvent: EventType) => void;
  deleteEvent: (eventId: string) => void;
  updateEventStatus: (
    eventId: string,
    newStatus: {
      isGoing?: boolean;
      isFavourite?: boolean;
      isRefused?: boolean;
    },
    user: UserType,
  ) => void;

  // Loaders
  loadInterests: () => Promise<void>;
  loadEvents: (user?: UserType) => Promise<void>;
  loadUsers: (userId: string, token: string) => Promise<void>;
  loadUser: (token: string) => Promise<void>;
  // Fetch en arrière-plan pour vérifier les nouvelles données
  refreshInterests: () => Promise<void>;
  refreshEvents: (user?: UserType) => Promise<void>;
  refreshUsers: (userId: string, token: string) => Promise<void>;
  // Permission checker
}

// Fonction pour vérifier si le sessionStorage est disponible
const isSessionStorageAvailable = () => {
  try {
    const testKey = "test";
    sessionStorage.setItem(testKey, "testValue");
    sessionStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// Custom sessionStorage wrapper pour gérer sessionStorage
const customStorage = {
  getItem: (name: string) => {
    if (isSessionStorageAvailable()) {
      const item = sessionStorage.getItem(name);
      return item ? JSON.parse(item) : null;
    }
    return null; // Si indisponible, retourner null
  },
  setItem: (name: string, value: any) => {
    if (isSessionStorageAvailable()) {
      sessionStorage.setItem(name, JSON.stringify(value));
    }
  },
  removeItem: (name: string) => {
    if (isSessionStorageAvailable()) {
      sessionStorage.removeItem(name);
    }
  },
};

export const useGlobalStore = create<GlobalStoreState>()(
  persist(
    (set, get) => ({
      userInfo: null,
      interests: [],
      events: [],
      users: [],

      setProfileData: (data: Partial<UserType>) => {
        set((state) => {
          if (!state.userInfo) return state;
          const updatedUserInfo: UserType = {
            ...state.userInfo,
            ...data,
          };

          return {
            ...state,
            userInfo: updatedUserInfo,
          };
        });
      },

      updateFollowingUserIds: (userId, action) => {
        set((state) => {
          if (!state.userInfo) return state;

          // Initialiser followingUserIds comme un tableau vide si undefined
          const currentFollowingIds = state.userInfo.followingUserIds || [];

          const updatedFollowingIds =
            action === "follow"
              ? [...currentFollowingIds, userId]
              : currentFollowingIds.filter((id) => id !== userId);

          return {
            userInfo: {
              ...state.userInfo,
              followingUserIds: updatedFollowingIds,
            },
          };
        });
      },

      setInterests: (interests) => set({ interests }),
      setEvents: (events) => set({ events }),
      setUsers: (users) => set({ users }),
      updateUser: (updatedUser: Partial<UserType>) => {
        set((state) => ({
          users: state.users.map((user) =>
            user._id === updatedUser._id ? { ...user, ...updatedUser } : user,
          ),
        }));
      },
      updateEventStatus: (eventId, newStatus, user) => {
        set((state) => ({
          events: state.events.map((event) => {
            if (event._id === eventId) {
              const updatedEvent = {
                ...event,
                isGoing: false,
                isFavourite: false,
                isRefused: false,
                attendees: event?.attendees?.filter(
                  (attendee) => attendee._id !== user._id,
                ),
                favouritees: event?.favouritees?.filter(
                  (favourite) => favourite._id !== user._id,
                ),
                refused: event?.refused?.filter(
                  (refusedUser) => refusedUser._id !== user._id,
                ),
              };
              if (newStatus.isGoing) {
                updatedEvent.isGoing = true;
                updatedEvent.attendees?.push(user);
              } else if (newStatus.isFavourite) {
                updatedEvent.isFavourite = true;
                updatedEvent.favouritees?.push(user);
              } else if (newStatus.isRefused) {
                updatedEvent.isRefused = true;
                updatedEvent.refused?.push(user);
              }
              return updatedEvent;
            }
            return event;
          }),
        }));
      },
      addEvent: (newEvent: EventType) => {
        set((state) => {
          const updatedUserInfo = state.userInfo
            ? {
                ...state.userInfo,
                hostedEvents: [
                  ...(state.userInfo?.hostedEvents || []),
                  newEvent,
                ],
              }
            : null;

          return {
            userInfo: updatedUserInfo,
            events: [...state.events, newEvent],
          };
        });
      },
      deleteEvent: (eventId: string) => {
        console.log("deleteEvent called with eventId:", eventId);
        set((state) => {
          const updatedEvents = state.events.filter(
            (event) => event._id !== eventId,
          );

          console.log("Updated events after delete:", updatedEvents);

          const updatedUserInfo = state.userInfo
            ? {
                ...state.userInfo,
                hostedEvents: state.userInfo?.hostedEvents?.filter(
                  (event) => event._id !== eventId,
                ),
              }
            : null;

          console.log("Updated userInfo after delete:", updatedUserInfo);

          return {
            events: updatedEvents,
            userInfo: updatedUserInfo,
          };
        });
      },

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

      loadEvents: async (user?: UserType) => {
        if (get().events.length > 0) return;
        const userIdQuery = user && user._id ? `?userId=${user._id}` : "";
        try {
          const upcomingEventRes = await fetchData(
            `/events/getUpcomingEvents${userIdQuery}`,
          );
          if (upcomingEventRes && !upcomingEventRes.error) {
            console.log("Upcoming Events !", upcomingEventRes.data);
            set({ events: upcomingEventRes.data as EventType[] });
          } else {
            console.error(
              "Erreur lors du fetch des événements:",
              upcomingEventRes?.error,
            );
          }
        } catch (error) {
          console.error("Erreur lors du fetch des événements:", error);
        }
      },
      loadUsers: async (userId: string, token: string) => {
        if (get().users.length > 0) return;
        const endpoint =
          userId && token
            ? `/users/followStatusForUsersYouFollow/${userId}`
            : "/users/allUserListing";
        try {
          const usersRes = await fetchData(
            endpoint,
            HttpMethod.GET,
            null,
            token,
          );
          if (usersRes && !usersRes.error) {
            set({ users: usersRes.data as UserType[] });
          } else {
            console.error(
              "Erreur lors du fetch des utilisateurs:",
              usersRes?.error,
            );
          }
        } catch (error) {
          console.error("Erreur lors du fetch des utilisateurs:", error);
        }
      },
      loadUser: async (token: string) => {
        try {
          const userRes = await fetchData(
            `/profile/getLoggedUserProfile`,
            HttpMethod.GET,
            null,
            token,
          );
          if (userRes && !userRes.error) {
            set({ userInfo: userRes.data as UserType });
          } else {
            console.error(
              "Erreur lors du fetch de l'utilisateur:",
              userRes?.error,
            );
          }
        } catch (error) {
          console.error("Erreur lors du fetch de l'utilisateur:", error);
        }
      },
      // Refresh en arrière-plan pour les intérêts
      refreshInterests: async () => {
        try {
          const interestRes = await fetchData("/users/getInterestsListing");
          if (interestRes && !interestRes.error) {
            const currentInterests = get().interests;
            const newInterests = interestRes.data as InterestType[];

            // Met à jour le store si de nouveaux intérêts sont trouvés
            if (
              JSON.stringify(currentInterests) !== JSON.stringify(newInterests)
            ) {
              // console.log("New Interests !", currentInterests, newInterests);
              set({ interests: newInterests });
            }
          }
        } catch (error) {
          console.error("Erreur lors du rafraîchissement des intérêts:", error);
        }
      },
      // Refresh en arrière-plan pour les événements
      refreshEvents: async (user?: UserType) => {
        const userIdQuery = user && user._id ? `?userId=${user._id}` : "";
        try {
          const upcomingEventRes = await fetchData(
            `/events/getUpcomingEvents${userIdQuery}`,
          );

          if (upcomingEventRes && !upcomingEventRes.error) {
            const currentEvents = get().events;
            const newEvents = upcomingEventRes.data as EventType[];

            // Met à jour le store si de nouveaux événements sont trouvés
            if (JSON.stringify(currentEvents) !== JSON.stringify(newEvents)) {
              console.log("New Events !", currentEvents, newEvents);
              set({ events: newEvents });
            }
          }
        } catch (error) {
          console.error(
            "Erreur lors du rafraîchissement des événements:",
            error,
          );
        }
      },
      refreshUsers: async (userId: string, token: string) => {
        const endpoint =
          userId && token
            ? `/users/followStatusForUsersYouFollow/${userId}`
            : "/users/allUserListing";
        try {
          const usersRes = await fetchData(
            endpoint,
            HttpMethod.GET,
            null,
            token,
          );
          if (usersRes && !usersRes.error) {
            const currentUsers = get().users;
            const newUsers = usersRes.data as UserType[];

            // Met à jour le store si de nouveaux utilisateurs sont trouvés
            if (JSON.stringify(currentUsers) !== JSON.stringify(newUsers)) {
              console.log("New Users !", currentUsers, newUsers);
              set({ users: newUsers });
            }
          }
        } catch (error) {
          console.error(
            "Erreur lors du rafraichelissement des utilisateurs:",
            error,
          );
        }
      },
    }),
    {
      name: "global-store", // Clé unique pour sessionStorage
      storage: customStorage, // Utilisation de sessionStorage
    },
  ),
);
