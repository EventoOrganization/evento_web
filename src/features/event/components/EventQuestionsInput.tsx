import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Question, useEventStore } from "@/store/useEventStore";

const Form = () => {
  const {
    questions,
    addQuestion,
    updateQuestion,
    removeQuestion,
    addOption,
    updateOption,
    removeOption,
  } = useEventStore();
  console.log("Questions state:", questions);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Create Your Form</h2>
      {Array.isArray(questions) &&
        questions.map((question, index) => (
          <div key={question.id} className="space-y-2 p-4 border rounded-lg">
            <Input
              value={question.question}
              onChange={(e) =>
                updateQuestion(index, { question: e.target.value })
              }
              placeholder="Enter your question"
              className="rounded-xl bg-muted sm:bg-background"
            />
            <select
              value={question.type}
              onChange={(e) =>
                updateQuestion(index, {
                  type: e.target.value as Question["type"],
                })
              }
              className="rounded-xl bg-muted sm:bg-background"
            >
              <option value="text">Text</option>
              <option value="multiple-choice">Multiple Choice</option>
              <option value="checkbox">Checkbox</option>
            </select>
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
                      className="rounded-xl bg-muted sm:bg-background mr-2"
                    />
                    <Button
                      type="button"
                      className="bg-red-500 text-white rounded-full"
                      onClick={() => removeOption(index, optionIndex)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  className="bg-green-500 text-white rounded-full mt-2"
                  onClick={() => addOption(index)}
                >
                  Add Choice
                </Button>
              </>
            )}
            <div className="flex items-center justify-between mt-2">
              <Checkbox
                checked={question.required}
                onCheckedChange={(checked) =>
                  updateQuestion(index, { required: true })
                }
              />
              <Button
                type="button"
                className="bg-red-500 text-white rounded-full"
                onClick={() => removeQuestion(index)}
              >
                Remove Question
              </Button>
            </div>
          </div>
        ))}
      <Button
        type="button"
        className="bg-blue-500 text-white rounded-full mt-2"
        onClick={addQuestion}
      >
        Add Question
      </Button>
    </div>
  );
};

export default Form;
