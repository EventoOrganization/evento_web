import { InterestType, QuestionType, TimeSlotType } from "@/types/EventType";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type EventFormState = {
  title: string;
  eventType: "public" | "private";
  username: string;
  mode: "virtual" | "in-person" | "both";
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
  timeZone?: string;
  URL?: string;
  coHosts?: string[];
  interests?: InterestType[];
  isTimeSlotsEnabled: boolean;
  timeSlots: TimeSlotType[];
  privateEventLink?: string;
  mediaPreviews?: string[];
  tempMediaPreview?: string[];
  questions: QuestionType[];
  uploadedMedia: { images: File[]; videos: File[] };
  predefinedMedia: { images: string[]; videos: string[] };
  additionalField?: any[];
  setEventField: (key: string, value: any) => void;
  clearEventForm: () => void;
  addQuestion: () => void;
  updateQuestion: (
    index: number,
    updatedQuestion: Partial<QuestionType>,
  ) => void;
  removeQuestion: (index: number) => void;
  addOption: (questionIndex: number) => void;
  updateOption: (
    questionIndex: number,
    optionIndex: number,
    value: string,
  ) => void;
  removeOption: (questionIndex: number, optionIndex: number) => void;
  addUploadedMedia: (
    file: File,
    type: "image" | "video",
    thumbnail: string,
  ) => void;
  addPredefinedMedia: (url: string, type: "image" | "video") => void;
};

export const useEventStore = create<EventFormState>()(
  persist(
    (set) => ({
      questions: [],
      title: "",
      eventType: "public",
      username: "",
      mode: "in-person",
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
      timeZone: undefined,
      URL: undefined,
      mediaPreviews: [],
      tempMediaPreview: [],
      timeSlots: [],
      isTimeSlotsEnabled: false,
      coHosts: [],
      interests: [],
      uploadedMedia: { images: [], videos: [] },
      predefinedMedia: { images: [], videos: [] },
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

      // Add uploaded media
      addUploadedMedia: (file, type) =>
        set((state) => {
          const updatedMedia = { ...state.uploadedMedia };
          if (type === "image") {
            updatedMedia.images.push(file);
          } else if (type === "video") {
            updatedMedia.videos.push(file);
          }
          return { uploadedMedia: updatedMedia };
        }),

      // Add predefined media
      addPredefinedMedia: (url, type) =>
        set((state) => {
          const updatedMedia = { ...state.predefinedMedia };
          if (type === "image") {
            updatedMedia.images.push(url);
          } else if (type === "video") {
            updatedMedia.videos.push(url);
          }
          return { predefinedMedia: updatedMedia };
        }),

      clearEventForm: () =>
        set({
          title: "",
          eventType: "public",
          username: "",
          mode: "in-person",
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
          timeZone: undefined,
          URL: undefined,
          mediaPreviews: [],
          timeSlots: [],
          isTimeSlotsEnabled: false,
          coHosts: [],
          interests: [],
          uploadedMedia: { images: [], videos: [] },
          predefinedMedia: { images: [], videos: [] },
          questions: [],
          additionalField: [],
        }),
    }),
    {
      name: "event-form-storage",
    },
  ),
);
