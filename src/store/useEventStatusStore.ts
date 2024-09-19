import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EventStatus {
  going: boolean;
  favourite: boolean;
  refused: boolean;
}

interface EventStatusState {
  eventStatuses: Record<string, EventStatus>;
  setEventStatus: (eventId: string, status: EventStatus) => void;
  toggleGoing: (eventId: string) => void;
  toggleFavourite: (eventId: string) => void;
  toggleRefused: (eventId: string) => void;
}

export const useEventStatusStore = create<EventStatusState>()(
  persist(
    (set) => ({
      eventStatuses: {},

      setEventStatus: (eventId: string, status: EventStatus) =>
        set((state) => ({
          eventStatuses: {
            ...state.eventStatuses,
            [eventId]: status,
          },
        })),

      toggleGoing: (eventId: string) =>
        set((state) => ({
          eventStatuses: {
            ...state.eventStatuses,
            [eventId]: {
              ...state.eventStatuses[eventId],
              going: !state.eventStatuses[eventId]?.going,
            },
          },
        })),

      toggleFavourite: (eventId: string) =>
        set((state) => ({
          eventStatuses: {
            ...state.eventStatuses,
            [eventId]: {
              ...state.eventStatuses[eventId],
              favourite: !state.eventStatuses[eventId]?.favourite,
            },
          },
        })),
      toggleRefused: (eventId: string) =>
        set((state) => ({
          eventStatuses: {
            ...state.eventStatuses,
            [eventId]: {
              ...state.eventStatuses[eventId],
              refused: !state.eventStatuses[eventId]?.refused,
            },
          },
        })),
    }),
    {
      name: "event-status-store",
      getStorage: () => sessionStorage,
    },
  ),
);
