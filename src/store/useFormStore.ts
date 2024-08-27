import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Question = {
  id: string;
  question: string;
  type: "text" | "multiple-choice" | "checkbox";
  options?: string[]; // Applicable pour 'multiple-choice' et 'checkbox'
  required: boolean;
};

export type FormState = {
  questions: Question[];
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

export const useFormStore = create<FormState>()(
  persist(
    (set) => ({
      questions: [],
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
    }),
    { name: "form-storage" },
  ),
);
