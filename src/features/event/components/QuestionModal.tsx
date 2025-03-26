import { Button } from "@/components/ui/button";
import { QuestionType } from "@/types/EventType";
import { XIcon } from "lucide-react";
import React, { useState } from "react";

type QuestionModalProps = {
  questions: QuestionType[];
  onSubmit: (
    answers: { questionId: string; answer: string | string[] }[],
  ) => void;
  onClose: () => void;
  context?: "rsvp" | "announcement";
};

const QuestionModal: React.FC<QuestionModalProps> = ({
  questions,
  onSubmit,
  onClose,
  context,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<
    { questionId: string; answer: string | string[] }[]
  >([]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerChange = (
    questionId: string,
    answer: string | string[],
  ) => {
    setAnswers((prev) => {
      const updatedAnswers = prev.filter(
        (ans) => ans.questionId !== questionId,
      );
      return [...updatedAnswers, { questionId, answer }];
    });
    if (
      currentQuestion.type === "multiple-choice" &&
      currentQuestionIndex < questions.length - 1
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion.required) {
      const answered = answers.some(
        (ans) => ans.questionId === currentQuestion._id && ans.answer,
      );
      if (!answered) {
        alert("This question is required. Please answer.");
        return;
      }
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  const isQuestionRequired = (question: QuestionType): boolean => {
    if (context === "announcement") return true;
    return !!question.required;
  };

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = () => {
    const unansweredRequiredQuestions = questions.filter(
      (question) =>
        question.required &&
        !answers.some((ans) => ans.questionId === question._id && ans.answer),
    );

    if (unansweredRequiredQuestions.length > 0) {
      alert("Please answer all required questions.");
      return;
    }

    onSubmit(answers);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-lg relative">
        <h2 className="text-2xl mb-4">Please answer the questions</h2>

        {/* Question Rendering */}
        <div key={currentQuestion._id} className="mb-4">
          <p>
            {currentQuestion.question}{" "}
            {!currentQuestion.required && context !== "announcement" && (
              <span className="text-gray-500">(Optional)</span>
            )}
          </p>

          {currentQuestion.type === "text" && (
            <input
              type="text"
              className="border rounded p-2 w-full"
              onChange={(e) =>
                handleAnswerChange(currentQuestion._id, e.target.value)
              }
            />
          )}

          {(currentQuestion.type === "multiple-choice" ||
            currentQuestion.displayType === "checkbox") && (
            <select
              multiple
              className="border rounded p-2 w-full"
              onChange={(e) =>
                handleAnswerChange(
                  currentQuestion._id,
                  Array.from(e.target.selectedOptions, (opt) => opt.value),
                )
              }
            >
              {currentQuestion.options?.map((option: string, idx: number) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}

          {(currentQuestion.type === "checkbox" ||
            currentQuestion.displayType === "radio") && (
            <div className="flex flex-wrap gap-2">
              {currentQuestion.options?.map((option: string, idx: number) => (
                <label key={idx} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={option}
                    onChange={(e) => {
                      const currentAnswers = answers.find(
                        (ans) => ans.questionId === currentQuestion._id,
                      )?.answer;

                      handleAnswerChange(
                        currentQuestion._id,
                        e.target.checked
                          ? Array.isArray(currentAnswers)
                            ? [...currentAnswers, e.target.value]
                            : [e.target.value]
                          : Array.isArray(currentAnswers)
                            ? currentAnswers.filter(
                                (val: string) => val !== e.target.value,
                              )
                            : [],
                      );
                    }}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-4">
          <button
            className="btn absolute top-4 right-4"
            onClick={() => onClose()}
          >
            <XIcon />
          </button>

          <button
            className="btn"
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
          >
            Back
          </button>

          {currentQuestionIndex < questions.length - 1 ? (
            <>
              {!currentQuestion.required && context != "announcement" && (
                <button className="btn" onClick={handleSkip}>
                  Skip
                </button>
              )}
              <Button
                disabled={
                  isQuestionRequired(currentQuestion) &&
                  !answers.some(
                    (ans) =>
                      ans.questionId === currentQuestion._id &&
                      ans.answer &&
                      (Array.isArray(ans.answer)
                        ? ans.answer.length > 0
                        : true),
                  )
                }
                className="btn"
                onClick={handleNext}
                variant={"eventoPrimary"}
              >
                Next
              </Button>
            </>
          ) : (
            <Button
              disabled={questions.some(
                (question) =>
                  isQuestionRequired(question) &&
                  !answers.some(
                    (ans) =>
                      ans.questionId === question._id &&
                      ans.answer &&
                      (Array.isArray(ans.answer)
                        ? ans.answer.length > 0
                        : true),
                  ),
              )}
              className="btn"
              onClick={handleSubmit}
              variant={"eventoPrimary"}
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
