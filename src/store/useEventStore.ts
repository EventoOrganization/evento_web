import { create } from "zustand";
import { persist } from "zustand/middleware";
export type TimeSlot = {
  date: string;
  startTime: string;
  endTime: string;
};
type Interest = {
  value: string;
  label: string;
};
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
  interests?: Interest[];
  timeSlots: TimeSlot[];
  privateEventLink?: string;
  imagePreviews?: string[];
  videoPreview?: string;
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
      imagePreviews: [],
      videoPreview: undefined,
      timeSlots: [],
      coHosts: [],
      guests: [],
      interestId: [],
      interests: [],
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
          imagePreviews: [],
          videoPreview: undefined,
          coHosts: [],
          timeSlots: [],
          guests: [],
          interestId: [],
          interests: [],
          questions: [],
          additionalField: undefined,
        }),
    }),
    {
      name: "event-form-storage",
    },
  ),
);
