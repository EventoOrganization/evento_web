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
import { Question, useEventStore } from "@/store/useEventStore";
import { useEffect } from "react";
import { handleFieldChange } from "../eventActions";
const Form = () => {
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

  // Log every render
  useEffect(() => {
    console.log("Component Rendered");
  });

  // Log the value of createRSVP whenever it changes
  useEffect(() => {
    console.log("createRSVP:", createRSVP);
  }, [createRSVP]);

  const handleRSVPChange = () => {
    const newState = !createRSVP;
    handleFieldChange("createRSVP", newState);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-eventoPurpleLight font-bold"></h4>
      <div className="flex items-center">
        <Button
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
                      type: value as Question["type"],
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
                          variant="destructive"
                          onClick={() => removeOption(index, optionIndex)}
                        >
                          Remove Choice
                        </Button>
                      </div>
                    ))}
                    <Button type="button" onClick={() => addOption(index)}>
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
                      className="checked:bg-red-500"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    className=""
                    onClick={() => removeQuestion(index)}
                  >
                    Remove Question
                  </Button>
                </div>
              </div>
            ))}
          <Button type="button" className="mt-2" onClick={addQuestion}>
            Add Question
          </Button>
        </>
      )}
    </div>
  );
};

export default Form;
