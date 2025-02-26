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
import { useCreateEventStore } from "@/store/useCreateEventStore";
import { QuestionType } from "@/types/EventType";
import { ChevronDown, Info, Plus, Trash, X } from "lucide-react";
import { handleFieldChange } from "../eventActions";
const EventQuestionsForm = () => {
  const {
    questions,
    addQuestion,
    updateQuestion,
    removeQuestion,
    addOption,
    updateOption,
    removeOption,
    createRSVP,
  } = useCreateEventStore();

  const handleRSVPChange = () => {
    const newState = !createRSVP;
    handleFieldChange("createRSVP", newState);
  };
  const handleAddQuestion = () => {
    if (!createRSVP || questions.length === 0) {
      handleRSVPChange();
    }
    addQuestion();
  };

  const handleRemoveQuestion = (index: number) => {
    removeQuestion(index);

    if (questions.length === 1) {
      handleRSVPChange();
    }
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
          {Array.isArray(questions) &&
            questions.map((question, index) => (
              <div key={question.id} className="space-y-2">
                {" "}
                <div className="flex items-center justify-between mt-2 gap-2">
                  <Select
                    value={question.type}
                    onValueChange={(value) =>
                      updateQuestion(index, {
                        type: value as QuestionType["type"],
                      })
                    }
                  >
                    <SelectTrigger className="w-40 text-muted-foreground">
                      <>
                        <SelectValue placeholder="Select type " />
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
                      id="required"
                      checked={question.required}
                      onCheckedChange={(checked) =>
                        updateQuestion(index, { required: checked === true })
                      }
                    />
                    <div className="relative group">
                      <Label
                        htmlFor="required"
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
                    updateQuestion(index, { question: e.target.value })
                  }
                  placeholder="Enter your question"
                  className=""
                />
                {(question.type === "multiple-choice" ||
                  question.type === "checkbox") && (
                  <>
                    {question.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center">
                        <Input
                          value={option}
                          onChange={(e) =>
                            updateOption(index, optionIndex, e.target.value)
                          }
                          placeholder={`Enter Option ${optionIndex + 1}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className=" hover:bg-gray-200 ml-2"
                          onClick={() => removeOption(index, optionIndex)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      className=" hover:bg-gray-200"
                      onClick={() => addOption(index)}
                    >
                      <Plus className="w-4 h-4" /> Add Options
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

export default EventQuestionsForm;
