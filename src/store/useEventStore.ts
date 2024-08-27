import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Question = {
  id: string;
  question: string;
  type: "text" | "multiple-choice" | "checkbox";
  options?: string[];
  required: boolean;
};

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
  questions: Question[];
  guestsAllowFriend: boolean;
  additionalField?: any[];
  setEventField: (key: string, value: any) => void;
  clearEventForm: () => void;
  addQuestion: () => void;
  updateQuestion: (index: number, updatedQuestion: Partial<Question>) => void;
  removeQuestion: (index: number) => void;
  addOption: (questionIndex: number) => void;
  updateOption: (
    questionIndex: number,
    optionIndex: number,
    value: string,
  ) => void;
  removeOption: (questionIndex: number, optionIndex: number) => void;
};
export const useEventStore = create<EventFormState>()(
  persist(
    (set) => ({
      questions: [],
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
      guestsAllowFriend: false,
      additionalField: [],

      setEventField: (key, value) =>
        set((state) => ({ ...state, [key]: value })),

      addQuestion: () =>
        set((state) => ({
          questions: [
            ...state.questions,
            {
              id: Date.now().toString(),
              question: "",
              type: "text",
              required: false,
              options: [],
            },
          ],
        })),
      updateQuestion: (index, updatedQuestion) =>
        set((state) => {
          const updatedQuestions = [...state.questions];
          updatedQuestions[index] = {
            ...updatedQuestions[index],
            ...updatedQuestion,
          };
          return { questions: updatedQuestions };
        }),
      removeQuestion: (index) =>
        set((state) => ({
          questions: state.questions.filter((_, i) => i !== index),
        })),
      addOption: (questionIndex) =>
        set((state) => {
          const updatedQuestions = [...state.questions];
          const options = updatedQuestions[questionIndex].options || [];
          updatedQuestions[questionIndex].options = [...options, ""];
          return { questions: updatedQuestions };
        }),
      updateOption: (questionIndex, optionIndex, value) =>
        set((state) => {
          const updatedQuestions = [...state.questions];
          if (updatedQuestions[questionIndex].options) {
            updatedQuestions[questionIndex].options![optionIndex] = value;
          }
          return { questions: updatedQuestions };
        }),
      removeOption: (questionIndex, optionIndex) =>
        set((state) => {
          const updatedQuestions = [...state.questions];
          if (updatedQuestions[questionIndex].options) {
            updatedQuestions[questionIndex].options = updatedQuestions[
              questionIndex
            ].options!.filter((_, i) => i !== optionIndex);
          }
          return { questions: updatedQuestions };
        }),

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
