import { EventType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { fetchData } from "@/utils/fetchData";
import { handleError } from "@/utils/handleError";
import { handleLog } from "@/utils/handleLog";
import { handleWarning } from "@/utils/handleWarning";
import { StateCreator } from "zustand";

export interface EventSlice {
  events: EventType[];
  loadEvents: (user?: UserType) => Promise<void>;
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

export const createEventSlice: StateCreator<EventSlice> = (set) => ({
  events: [],

  loadEvents: async (user?: UserType) => {
    try {
      handleLog("🔄 Loading events...");
      const userIdQuery = user?._id ? `?userId=${user._id}` : "";
      const res = await fetchData(`/events/getUpcomingEvents${userIdQuery}`);

      if (res.ok) {
        set({ events: res.data as EventType[] });
        handleLog("✅ Events loaded successfully!");
      } else {
        handleWarning({
          message: "⚠️ Failed to load events",
          source: "loadEvents",
          originalError: res.error,
        });
      }
    } catch (error) {
      handleError(error, "loadEvents");
    }
  },

  addEvent: (newEvent) => {
    try {
      handleLog("➕ Adding new event...");
      set((state) => ({
        events: [...state.events, newEvent],
      }));
      handleLog("✅ Event added successfully!");
    } catch (error) {
      handleError(error, "addEvent");
    }
  },

  updateEvent: (eventId, updatedEvent) => {
    try {
      handleLog(`✏️ Updating event ${eventId}...`);
      set((state) => ({
        events: state.events.map((event) =>
          event._id === eventId ? { ...event, ...updatedEvent } : event,
        ),
      }));
      handleLog("✅ Event updated successfully!");
    } catch (error) {
      handleError(error, "updateEvent");
    }
  },

  deleteEvent: (eventId) => {
    try {
      handleLog(`🗑️ Deleting event ${eventId}...`);
      set((state) => ({
        events: state.events.filter((event) => event._id !== eventId),
      }));
      handleLog("✅ Event deleted successfully!");
    } catch (error) {
      handleError(error, "deleteEvent");
    }
  },

  updateEventStatus: (eventId, newStatus, user) => {
    try {
      if (!user || !user._id) {
        handleWarning({
          message: "⚠️ Cannot update event status: userInfo is null",
          source: "updateEventStatus",
        });
        return;
      }

      handleLog(`🔄 Updating event status for ${eventId}...`);

      set((state) => ({
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
});
