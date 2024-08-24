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
  images: string[]; // Store image URLs as an array
  video?: string; // Store video URL as a single string
  questions?: {
    question: string;
    answer: string;
    required: boolean;
    options?: string[];
  }[];
  additionalField?: any;
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
      images: [], // Initialize images as an empty array
      video: undefined, // Initialize video as undefined
      questions: [],
      additionalField: undefined,
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
          images: [], // Clear images array
          video: undefined, // Clear video
          questions: [],
          additionalField: undefined,
        }),
    }),
    {
      name: "event-form-storage",
    },
  ),
);
