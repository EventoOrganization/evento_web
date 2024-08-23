// src/store/useEventStore.ts
import { create } from "zustand";

type EventFormState = {
  title: string;
  eventType: string;
  name: string;
  mode: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  includeChat: boolean;
  createRSVP: boolean;
  setEventField: (key: string, value: any) => void;
  clearEventForm: () => void;
};

export const useEventStore = create<EventFormState>((set) => ({
  title: "",
  eventType: "public",
  name: "",
  mode: "virtual",
  date: "",
  startTime: "",
  endTime: "",
  description: "",
  includeChat: false,
  createRSVP: false,
  setEventField: (key, value) => set((state) => ({ ...state, [key]: value })),
  clearEventForm: () =>
    set({
      title: "",
      eventType: "public",
      name: "",
      mode: "virtual",
      date: "",
      startTime: "",
      endTime: "",
      description: "",
      includeChat: false,
      createRSVP: false,
    }),
}));
