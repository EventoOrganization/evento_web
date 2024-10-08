import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/store/useEventStore";
import { handleFieldChange } from "../eventActions";
import { QuestionType } from "@/types/EventType";
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
  } = useEventStore();

  const handleRSVPChange = () => {
    const newState = !createRSVP;
    handleFieldChange("createRSVP", newState);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-eventoPurpleLight font-bold"></h4>
      <div className="flex items-center">
        <Button
          type="button"
          variant={"outline"}
          className={cn("", { "bg-evento-gradient text-white": createRSVP })}
          onClick={handleRSVPChange}
        >
          Add an RSVP
        </Button>
      </div>

      {createRSVP && (
        <>
          <h4 className="text-eventoPurpleLight font-bold">Create Your RSVP</h4>
          {Array.isArray(questions) &&
            questions.map((question, index) => (
              <div key={question.id} className="space-y-2">
                <Input
                  value={question.question}
                  onChange={(e) =>
                    updateQuestion(index, { question: e.target.value })
                  }
                  placeholder="Enter your question"
                  className=""
                />
                <Select
                  value={question.type}
                  onValueChange={(value) =>
                    updateQuestion(index, {
                      type: value as QuestionType["type"],
                    })
                  }
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="multiple-choice">
                      Multiple Choice
                    </SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                  </SelectContent>
                </Select>
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
                          placeholder={`Choice ${optionIndex + 1}`}
                          className="mr-2"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="bg-gray-200 text-black border shadow"
                          onClick={() => removeOption(index, optionIndex)}
                        >
                          Remove Choice
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      className="bg-eventoPink hover:bg-eventoPink/80 border shadow"
                      onClick={() => addOption(index)}
                    >
                      Add Choice
                    </Button>
                  </>
                )}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center justify-center gap-2">
                    <Label htmlFor="required">Answer Required</Label>
                    <Checkbox
                      id="required"
                      checked={question.required}
                      onCheckedChange={(checked) =>
                        updateQuestion(index, { required: checked === true })
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="bg-gray-200 text-black border shadow"
                    onClick={() => removeQuestion(index)}
                  >
                    Remove Question
                  </Button>
                </div>
              </div>
            ))}
          <Button
            type="button"
            className="mt-2 bg-eventoPurpleLight hover:bg-eventoPurpleLight/80  border shadow"
            onClick={addQuestion}
          >
            Add Question
          </Button>
        </>
      )}
    </div>
  );
};

export default EventQuestionsForm;
