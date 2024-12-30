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
import { QuestionType } from "@/types/EventType";
import { useState } from "react";

interface EditableQuestionsFormProps {
  questions: QuestionType[];
  createRSVP: boolean;
  onAddQuestion: () => void;
  onUpdateQuestion: (
    index: number,
    updatedQuestion: Partial<QuestionType>,
  ) => void;
  onRemoveQuestion: (index: number) => void;
  onAddOption: (index: number) => void;
  onUpdateOption: (
    questionIndex: number,
    optionIndex: number,
    newOption: string,
  ) => void;
  onRemoveOption: (questionIndex: number, optionIndex: number) => void;
  onToggleRSVP: () => void;
  handleUpdate: () => void;
  handleCancel: () => void;
  handleReset: () => void;
  isUpdating: boolean;
}

const EditableQuestionsForm = ({
  questions,
  createRSVP,
  onAddQuestion,
  onUpdateQuestion,
  onRemoveQuestion,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
  onToggleRSVP,
  handleUpdate,
  handleCancel,
  handleReset,
  isUpdating,
}: EditableQuestionsFormProps) => {
  const [editMode, setEditMode] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-eventoPurpleLight">RSVP</h3>
        <div className="flex justify-end gap-2 items-center">
          {createRSVP ? (
            <>
              {editMode ? (
                <>
                  <Button
                    onClick={() => {
                      handleUpdate();
                      setEditMode(false);
                    }}
                    disabled={isUpdating}
                    className="bg-evento-gradient text-white"
                  >
                    {isUpdating ? "Updating..." : "Update"}
                  </Button>
                  <Button
                    onClick={() => {
                      handleCancel();
                      setEditMode(false);
                    }}
                    variant="outline"
                    className="text-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="text-red-600"
                  >
                    Reset
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditMode(true)} variant="outline">
                  Edit RSVP
                </Button>
              )}
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              className={!createRSVP ? "bg-evento-gradient text-white" : ""}
              onClick={() => {
                onToggleRSVP();
                setEditMode(true);
              }}
            >
              {createRSVP ? "Remove RSVP" : "Add an RSVP"}
            </Button>
          )}
        </div>
      </div>

      {createRSVP && (
        <>
          <h4 className="text-eventoPurpleLight font-bold">Create Your RSVP</h4>
          {questions.map((question, questionIndex) => (
            <div key={question.id} className="space-y-2">
              <Input
                value={question.question}
                onChange={(e) =>
                  onUpdateQuestion(questionIndex, { question: e.target.value })
                }
                placeholder="Enter your question"
                disabled={!editMode}
              />
              <Select
                value={question.type}
                disabled={!editMode}
                onValueChange={(value) =>
                  onUpdateQuestion(questionIndex, {
                    type: value as QuestionType["type"],
                  })
                }
              >
                <SelectTrigger>
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
                        disabled={!editMode}
                        onChange={(e) =>
                          onUpdateOption(
                            questionIndex,
                            optionIndex,
                            e.target.value,
                          )
                        }
                        placeholder={`Choice ${optionIndex + 1}`}
                        className="mr-2"
                      />
                      <Button
                        type="button"
                        disabled={!editMode}
                        variant="outline"
                        onClick={() =>
                          onRemoveOption(questionIndex, optionIndex)
                        }
                      >
                        Remove Choice
                      </Button>
                    </div>
                  )) || []}
                  <Button
                    type="button"
                    disabled={!editMode}
                    onClick={() => onAddOption(questionIndex)}
                  >
                    Add Choice
                  </Button>
                </>
              )}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="required">Answer Required</Label>
                  <Checkbox
                    id="required"
                    disabled={!editMode}
                    checked={question.required}
                    onCheckedChange={(checked) =>
                      onUpdateQuestion(questionIndex, {
                        required: checked === true,
                      })
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  disabled={!editMode}
                  onClick={() => onRemoveQuestion(questionIndex)}
                >
                  Remove Question
                </Button>
              </div>
            </div>
          ))}
          <Button disabled={!editMode} type="button" onClick={onAddQuestion}>
            Add Question
          </Button>
        </>
      )}
    </div>
  );
};

export default EditableQuestionsForm;
