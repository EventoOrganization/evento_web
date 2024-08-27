import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEventStore } from "@/store/useEventStore";
import { useFieldArray, useFormContext } from "react-hook-form";

interface Question {
  id: string;
  title: string;
  type: string;
  choices: string[];
  required: boolean;
}

const EventQuestionsInput = () => {
  const { control, setValue, watch } = useFormContext<{
    questions: Question[];
  }>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });
  const setEventField = useEventStore((state) => state.setEventField);
  const questions = watch("questions");

  const updateStore = () => {
    setEventField("questions", questions);
  };

  const addQuestion = () => {
    append({
      id: "",
      title: "",
      type: "multiple-choice",
      choices: [""],
      required: false,
    });
    updateStore();
  };

  const removeQuestion = (index: number) => {
    remove(index);
    updateStore();
  };

  const addChoice = (index: number) => {
    const currentChoices = watch(`questions.${index}.choices`) || [];
    setValue(`questions.${index}.choices`, [...currentChoices, ""]);
    updateStore();
  };

  const removeChoice = (questionIndex: number, choiceIndex: number) => {
    const currentChoices = watch(`questions.${questionIndex}.choices`) || [];
    const updatedChoices = currentChoices.filter(
      (_: string, i: number) => i !== choiceIndex,
    );
    setValue(`questions.${questionIndex}.choices`, updatedChoices);
    updateStore();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Event Questions</h3>
      {fields.map((item, index) => (
        <div key={item.id} className="space-y-2 p-4 border rounded-lg">
          <FormField
            name={`questions[${index}].title`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question {index + 1}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your question"
                    className="rounded-xl bg-muted sm:bg-background"
                    onChange={(e) => {
                      field.onChange(e);
                      updateStore();
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name={`questions[${index}].type`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Type</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="rounded-xl bg-muted sm:bg-background"
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setValue(`questions.${index}.choices`, [""]);
                      updateStore();
                    }}
                  >
                    <option value="text">Text</option>
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="checkbox">Checkbox</option>
                  </select>
                </FormControl>
              </FormItem>
            )}
          />
          {(watch(`questions.${index}.type`) === "multiple-choice" ||
            watch(`questions.${index}.type`) === "checkbox") && (
            <>
              {watch(`questions.${index}.choices`) &&
                watch(`questions.${index}.choices`).map(
                  (choice: string, choiceIndex: number) => (
                    <FormField
                      key={choiceIndex}
                      name={`questions[${index}].choices[${choiceIndex}]`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Choice {choiceIndex + 1}</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Input
                                {...field}
                                placeholder={`Choice ${choiceIndex + 1}`}
                                className="rounded-xl bg-muted sm:bg-background mr-2"
                                onChange={(e) => {
                                  field.onChange(e);
                                  updateStore();
                                }}
                              />
                              <Button
                                type="button"
                                className="bg-red-500 text-white rounded-full"
                                onClick={() => {
                                  removeChoice(index, choiceIndex);
                                  updateStore();
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ),
                )}
              <Button
                type="button"
                className="bg-green-500 text-white rounded-full mt-2"
                onClick={() => {
                  addChoice(index);
                  updateStore();
                }}
              >
                Add Choice
              </Button>
            </>
          )}
          <div className="flex items-center justify-between mt-2">
            <FormField
              name={`questions.${index}.required`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        updateStore();
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="button"
              className="bg-red-500 text-white rounded-full"
              onClick={() => {
                removeQuestion(index);
                updateStore();
              }}
            >
              Remove Question
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        className="bg-blue-500 text-white rounded-full mt-2"
        onClick={() => {
          addQuestion();
          updateStore();
        }}
      >
        Add Question
      </Button>
    </div>
  );
};

export default EventQuestionsInput;
