import { create } from "zustand";
import { persist } from "zustand/middleware";

type EventFormState = {
  title: string;
  eventType: "public" | "private";
  name: string;
  mode: "virtual" | "in-person";
  date: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  description: string;
  includeChat: boolean;
  createRSVP: boolean;
  latitude?: string;
  longitude?: string;
  location?: string;
  coHosts?: string[];
  guests?: string[];
  interestId?: string[];
  privateEventLink?: string;
  images?: any[];
  questions?: {
    question: string;
    answer: string;
    required: boolean;
    options?: string[];
  }[];
  additionalField?: any;
  video?: string;
  setEventField: (key: string, value: any) => void;
  clearEventForm: () => void;
};

export const useEventStore = create<EventFormState>()(
  persist(
    (set) => ({
      title: "",
      eventType: "public",
      name: "",
      mode: "virtual",
      date: "",
      endDate: undefined,
      startTime: "",
      endTime: "",
      description: "",
      includeChat: false,
      createRSVP: false,
      latitude: undefined,
      longitude: undefined,
      location: undefined,
      coHosts: [],
      guests: [],
      interestId: [],
      privateEventLink: undefined,
      images: [],
      questions: [],
      additionalField: undefined,
      video: undefined,
      setEventField: (key, value) =>
        set((state) => ({ ...state, [key]: value })),
      clearEventForm: () =>
        set({
          title: "",
          eventType: "public",
          name: "",
          mode: "virtual",
          date: "",
          endDate: undefined,
          startTime: "",
          endTime: "",
          description: "",
          includeChat: false,
          createRSVP: false,
          latitude: undefined,
          longitude: undefined,
          location: undefined,
          coHosts: [],
          guests: [],
          interestId: [],
          privateEventLink: undefined,
          images: [],
          questions: [],
          additionalField: undefined,
          video: undefined,
        }),
    }),
    {
      name: "event-form-storage", // Nom de la clé sous laquelle les données seront stockées dans le localStorage
    },
  ),
);
