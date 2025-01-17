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
  updateEvent: (updatedEvent: Partial<EventType>) => void;
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
// Custom localStorage wrapper to conform to zustand's PersistStorage type
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
    (set, get) => ({
      userInfo: null,
      interests: [],
      events: [],
      users: [],

      // Setters
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
      updateEvent: (updatedEvent: Partial<EventType>) => {
        set((state) => {
          const newEvents = state.events.map((event) =>
            event._id === updatedEvent._id
              ? { ...event, ...updatedEvent }
              : event,
          );

          return {
            events: newEvents,
            userInfo: state.userInfo?._id
              ? {
                  ...state.userInfo,
                  hostedEvents: state.userInfo.hostedEvents?.map((event) =>
                    event._id === updatedEvent._id
                      ? { ...event, ...updatedEvent }
                      : event,
                  ),
                }
              : state.userInfo,
          };
        });
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
        console.log("loadEvents called with user:", user);
        if (get().events.length > 0) return;
        const userIdQuery = user && user._id ? `?userId=${user._id}` : "";
        try {
          const upcomingEventRes = await fetchData(
            `/events/getUpcomingEvents${userIdQuery}`,
          );
          if (upcomingEventRes && !upcomingEventRes.error) {
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
      refreshInterests: async () => {
        try {
          const interestRes = await fetchData("/users/getInterestsListing");
          if (interestRes && !interestRes.error) {
            const currentInterests = get().interests;
            const newInterests = interestRes.data as InterestType[];

            if (
              JSON.stringify(currentInterests) !== JSON.stringify(newInterests)
            ) {
              set({ interests: newInterests });
            }
          }
        } catch (error) {
          console.error("Erreur lors du rafraîchissement des intérêts:", error);
        }
      },
      refreshEvents: async (user?: UserType) => {
        const userIdQuery = user && user._id ? `?userId=${user._id}` : "";
        try {
          const upcomingEventRes = await fetchData(
            `/events/getUpcomingEvents${userIdQuery}`,
          );

          if (upcomingEventRes && !upcomingEventRes.error) {
            const currentEvents = get().events;
            const newEvents = upcomingEventRes.data as EventType[];

            if (JSON.stringify(currentEvents) !== JSON.stringify(newEvents)) {
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

            if (JSON.stringify(currentUsers) !== JSON.stringify(newUsers)) {
              set({ users: newUsers });
            }
          }
        } catch (error) {
          console.error(
            "Erreur lors du rafraîchissement des utilisateurs:",
            error,
          );
        }
      },
    }),
    {
      name: "global-store",
      storage: isLocalStorageAvailable() ? localStorageCustom : undefined,
    },
  ),
);
