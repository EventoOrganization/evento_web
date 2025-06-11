"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/togglerbtn";
import { cn } from "@/lib/utils";
import { QuestionType } from "@/types/EventType";
import { ChevronDown, Info, Plus, Trash, X } from "lucide-react";
import { useState } from "react";

const FormQuestionsField = ({
  onChange,
}: {
  onChange: (field: string, value: any) => void;
}) => {
  const [createRSVP, setCreateRSVP] = useState(false);
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  const handleRSVPChange = () => {
    const newState = !createRSVP;
    setCreateRSVP(newState);
    if (!newState) {
      onChange("questions", []);
    }
    onChange("createRSVP", newState);
  };

  const handleAddQuestion = () => {
    if (!createRSVP) {
      handleRSVPChange();
    }
    const newQuestions = [
      ...questions,
      { question: "", type: "text", options: [], required: false },
    ] as QuestionType[];
    setQuestions(newQuestions);
    onChange("questions", newQuestions);
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    onChange("questions", newQuestions);

    if (newQuestions.length === 0) {
      handleRSVPChange(); // désactive RSVP si plus de questions
    }
  };

  const handleQuestionTypeChange = (
    index: number,
    value: "text" | "multiple-choice" | "checkbox",
  ) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index
        ? {
            ...q,
            type: value,
            options: value === "text" ? [] : (q.options ?? []),
          }
        : q,
    );
    setQuestions(updatedQuestions);
    onChange("questions", updatedQuestions);
  };

  const handleQuestionRequiredChange = (index: number, value: boolean) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index ? { ...q, required: value } : q,
    );
    setQuestions(updatedQuestions);
    onChange("questions", updatedQuestions);
  };

  const handleQuestionTextChange = (index: number, value: string) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index ? { ...q, question: value } : q,
    );
    setQuestions(updatedQuestions);
    onChange("questions", updatedQuestions);
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string,
  ) => {
    const updatedQuestions = questions.map((q, i) =>
      i === questionIndex
        ? {
            ...q,
            options: q.options?.map((opt, j) =>
              j === optionIndex ? value : opt,
            ),
          }
        : q,
    );
    setQuestions(updatedQuestions);
    onChange("questions", updatedQuestions);
  };

  const handleAddOption = (questionIndex: number) => {
    const updatedQuestions = questions.map((q, i) =>
      i === questionIndex ? { ...q, options: [...(q.options ?? []), ""] } : q,
    );
    setQuestions(updatedQuestions);
    onChange("questions", updatedQuestions);
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = questions.map((q, i) =>
      i === questionIndex
        ? {
            ...q,
            options: q.options?.filter((_, j) => j !== optionIndex),
          }
        : q,
    );
    setQuestions(updatedQuestions);
    onChange("questions", updatedQuestions);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-eventoPurpleLight font-bold"></h4>
      <div className="flex items-center gap-2">
        <Label>Create RSVP Form</Label>
        <Button
          type="button"
          variant="outline"
          className={cn("bg-gray-200 px-3")}
          onClick={handleAddQuestion}
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
        </Button>
      </div>

      {createRSVP && (
        <>
          {questions.map((question, index) => (
            <div key={index} className="space-y-2 border-b pb-4">
              <div className="flex items-center justify-between mt-2 gap-2">
                <Select
                  value={question.type}
                  onValueChange={(value) =>
                    handleQuestionTypeChange(
                      index,
                      value as "text" | "multiple-choice" | "checkbox",
                    )
                  }
                >
                  <SelectTrigger className="w-40 text-muted-foreground">
                    <>
                      <SelectValue placeholder="Select type" />
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    </>
                  </SelectTrigger>
                  <SelectContent className="text-muted-foreground">
                    <SelectItem value="text">Text Field</SelectItem>
                    <SelectItem value="multiple-choice">
                      Multiple Choice
                    </SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center justify-center gap-2">
                  <Switch
                    id={`required-${index}`}
                    checked={question.required}
                    onCheckedChange={(checked) =>
                      handleQuestionRequiredChange(index, checked)
                    }
                  />
                  <div className="relative group">
                    <Label
                      htmlFor={`required-${index}`}
                      className="hidden md:block cursor-pointer"
                    >
                      Required
                    </Label>
                    <Info className="w-4 h-4 cursor-pointer md:hidden" />

                    <div className="absolute left-1/2 -translate-x-1/2 bottom-8 md:bottom-auto md:top-8 w-32 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      This switch makes the question mandatory.
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    className="gap-2 hover:bg-gray-200"
                    onClick={() => handleRemoveQuestion(index)}
                  >
                    <Trash className="w-4 h-4" />
                    <span className="hidden md:block">Delete</span>
                  </Button>
                </div>
              </div>

              <Input
                value={question.question}
                onChange={(e) =>
                  handleQuestionTextChange(index, e.target.value)
                }
                placeholder="Enter your question"
              />

              {(question.type === "multiple-choice" ||
                question.type === "checkbox") && (
                <>
                  {question.options?.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center mt-1">
                      <Input
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, optionIndex, e.target.value)
                        }
                        placeholder={`Enter Option ${optionIndex + 1}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className=" hover:bg-gray-200 ml-2"
                        onClick={() => handleRemoveOption(index, optionIndex)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="ghost"
                    className=" hover:bg-gray-200 mt-2"
                    onClick={() => handleAddOption(index)}
                  >
                    <Plus className="w-4 h-4" /> Add Option
                  </Button>
                </>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default FormQuestionsField;
