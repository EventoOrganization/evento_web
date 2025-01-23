import React, { useState } from "react";

type QuestionModalProps = {
  questions: any[];
  onSubmit: (answers: any) => void;
  onClose: () => void;
};

const QuestionModal: React.FC<QuestionModalProps> = ({
  questions,
  onSubmit,
  onClose,
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

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(answers);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-lg">
        <h2 className="text-2xl mb-4">Please answer the questions</h2>

        {/* Question Rendering */}
        <div key={currentQuestion._id} className="mb-4">
          <p>
            {currentQuestion.question}{" "}
            {!currentQuestion.required && (
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

          {currentQuestion.type === "multiple-choice" && (
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
              {currentQuestion.options.map((option: string, idx: number) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}

          {currentQuestion.type === "checkbox" && (
            <div className="flex flex-wrap gap-2">
              {currentQuestion.options.map((option: string, idx: number) => (
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
          <button className="btn" onClick={() => onClose()}>
            Close
          </button>

          {currentQuestionIndex < questions.length - 1 ? (
            <>
              {!currentQuestion.required && (
                <button className="btn" onClick={handleSkip}>
                  Skip
                </button>
              )}
              <button className="btn" onClick={handleNext}>
                Next
              </button>
            </>
          ) : (
            <button className="btn" onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
