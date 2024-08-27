import { Question } from "@/types/EventType";
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
  guestsAllowFriend: boolean;
  additionalField?: [];
  setEventField: (key: string, value: any) => void;
  updateQuestion: (index: number, value: Partial<Question>) => void;
  addChoiceToQuestion: (index: number, choice: string) => void;
  removeChoiceFromQuestion: (index: number, choiceIndex: number) => void;
  addQuestion: () => void;
  removeQuestion: (index: number) => void;
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
      guestsAllowFriend: false,
      additionalField: [],

      setEventField: (key, value) =>
        set((state) => ({ ...state, [key]: value })),

      updateQuestion: (index, value) =>
        set((state) => {
          const updatedQuestions = [...(state.questions || [])];
          updatedQuestions[index] = { ...updatedQuestions[index], ...value };
          return { questions: updatedQuestions };
        }),

      addChoiceToQuestion: (index, choice) =>
        set((state) => {
          const updatedQuestions = [...(state.questions || [])];
          const updatedChoices = [
            ...(updatedQuestions[index].options || []),
            choice,
          ];
          updatedQuestions[index].options = updatedChoices;
          return { questions: updatedQuestions };
        }),

      removeChoiceFromQuestion: (index, choiceIndex) =>
        set((state) => {
          const updatedQuestions = [...(state.questions || [])];
          const updatedChoices = updatedQuestions[index].options?.filter(
            (_, i) => i !== choiceIndex,
          );
          updatedQuestions[index].options = updatedChoices;
          return { questions: updatedQuestions };
        }),

      addQuestion: () =>
        set((state) => ({
          questions: [
            ...(state.questions || []),
            {
              question: "",
              answer: "",
              required: false,
              options: [],
              type: "text",
            },
          ],
        })),

      removeQuestion: (index) =>
        set((state) => ({
          questions: state.questions?.filter((_, i) => i !== index),
        })),

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
          timeSlots: [],
          coHosts: [],
          guests: [],
          interestId: [],
          interests: [],
          questions: [],
          guestsAllowFriend: false,
          additionalField: [],
        }),
    }),
    {
      name: "event-form-storage",
    },
  ),
);
