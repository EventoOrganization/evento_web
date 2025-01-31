import { EventType } from "@/types/EventType"; // Correction de l'import
import { UserType } from "@/types/UserType";
import { fetchData } from "@/utils/fetchData";
import { handleError } from "@/utils/handleError";
import { handleLog } from "@/utils/handleLog";
import { handleWarning } from "@/utils/handleWarning";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ✅ Vérification de la disponibilité du localStorage
const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = "test";
    localStorage.setItem(testKey, "testValue");
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// ✅ Définition de l'état du store Zustand
interface EventState {
  hasMore: boolean;
  events: EventType[];
  loadEvents: (
    user?: UserType,
    seachQuery?: string,
    updateStore?: boolean,
  ) => Promise<EventType[]>;
  addEvent: (newEvent: EventType) => void;
  updateEvent: (eventId: string, updatedEvent: Partial<EventType>) => void;
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
}

// ✅ Gestion custom du localStorage
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

// ✅ Création du store Zustand avec typage strict
export const useEventStore = create<EventState>()(
  persist(
    (set) => ({
      hasMore: false,
      events: [],

      loadEvents: async (
        user?: UserType,
        searchQuery?: string,
        updateStore = true,
      ) => {
        try {
          handleLog("🔄 Loading events...");
          const userIdQuery = user?._id ? `userId=${user._id}` : "";
          const searchParam = searchQuery
            ? `search=${encodeURIComponent(searchQuery)}`
            : "";

          const queryParams = [userIdQuery, searchParam]
            .filter(Boolean)
            .join("&");
          const url = `/events/getEvents?${queryParams}`;

          const res = await fetchData<{
            events: EventType[];
            hasMore: boolean;
          }>(url);

          if (res.ok && res.data) {
            handleLog("✅ Events loaded successfully!");

            if (updateStore) {
              set({
                events: res.data.events ?? [],
                hasMore: res.data.hasMore ?? false,
              });
            }

            return res.data.events ?? []; // 🔥 Retourne les événements aussi
          } else {
            handleWarning({
              message: "⚠️ Failed to load events",
              source: "loadEvents",
              originalError: res.error,
            });
            return [];
          }
        } catch (error) {
          // handleError(error, "loadEvents");
          return [];
        }
      },

      addEvent: (newEvent: EventType) => {
        try {
          handleLog("➕ Adding new event...");
          set((state: EventState) => ({
            events: [...state.events, newEvent],
          }));
          handleLog("✅ Event added successfully!");
        } catch (error) {
          handleError(error, "addEvent");
        }
      },

      updateEvent: (eventId: string, updatedEvent: Partial<EventType>) => {
        try {
          handleLog(`✏️ Updating event ${eventId}...`);
          set((state: EventState) => ({
            events: state.events.map((event) =>
              event._id === eventId ? { ...event, ...updatedEvent } : event,
            ),
          }));
          handleLog("✅ Event updated successfully!");
        } catch (error) {
          handleError(error, "updateEvent");
        }
      },

      deleteEvent: (eventId: string) => {
        try {
          handleLog(`🗑️ Deleting event ${eventId}...`);
          set((state: EventState) => ({
            events: state.events.filter((event) => event._id !== eventId),
          }));
          handleLog("✅ Event deleted successfully!");
        } catch (error) {
          handleError(error, "deleteEvent");
        }
      },

      updateEventStatus: (
        eventId: string,
        newStatus: {
          isGoing?: boolean;
          isFavourite?: boolean;
          isRefused?: boolean;
        },
        user: UserType,
      ) => {
        try {
          if (!user || !user._id) {
            handleWarning({
              message: "⚠️ Cannot update event status: userInfo is null",
              source: "updateEventStatus",
            });
            return;
          }

          handleLog(`🔄 Updating event status for ${eventId}...`);

          set((state: EventState) => ({
            events: state.events.map((event) => {
              if (event._id !== eventId) return event;

              return {
                ...event,
                isGoing: newStatus.isGoing || false,
                isFavourite: newStatus.isFavourite || false,
                isRefused: newStatus.isRefused || false,
                attendees: newStatus.isGoing
                  ? [...(event.attendees || []), user]
                  : event.attendees?.filter(
                      (attendee) => attendee._id !== user._id,
                    ),
                favouritees: newStatus.isFavourite
                  ? [...(event.favouritees || []), user]
                  : event.favouritees?.filter((fav) => fav._id !== user._id),
                refused: newStatus.isRefused
                  ? [...(event.refused || []), user]
                  : event.refused?.filter((r) => r._id !== user._id),
              };
            }),
          }));

          handleLog("✅ Event status updated successfully!");
        } catch (error) {
          handleError(error, "updateEventStatus");
        }
      },
    }),
    {
      name: "event-store",
      storage: isLocalStorageAvailable() ? localStorageCustom : undefined,
    },
  ),
);
