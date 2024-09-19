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
  const [answers, setAnswers] = useState<
    { questionId: string; answer: string | string[] }[]
  >([]);

  const handleAnswerChange = (
    questionId: string,
    answer: string | string[],
  ) => {
    setAnswers((prev) => {
      const existingAnswer = prev.find((ans) => ans.questionId === questionId);

      // Initialize the updatedAnswer as an array
      let updatedAnswer: string[] = [];

      if (typeof answer === "string") {
        // If answer is a string, handle it accordingly
        updatedAnswer = [answer];
      } else {
        // If answer is an array, process it
        if (existingAnswer && Array.isArray(existingAnswer.answer)) {
          updatedAnswer = existingAnswer.answer.filter(
            (val: string) => !answer.includes(val),
          );
        } else {
          updatedAnswer = [...answer];
        }
      }

      const updatedAnswers = prev.filter(
        (ans) => ans.questionId !== questionId,
      );
      return [...updatedAnswers, { questionId, answer: updatedAnswer }];
    });
  };

  const handleSubmit = () => {
    const allRequiredAnswered = questions.every(
      (question) =>
        !question.required ||
        (question.required &&
          answers.some((ans) => ans.questionId === question.id && ans.answer)),
    );

    if (allRequiredAnswered) {
      onSubmit(answers);
      onClose(); // Ferme la modale après la soumission
    } else {
      alert("Please answer all required questions.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-lg">
        <h2 className="text-2xl mb-4">Please answer the following questions</h2>
        {questions.map((question) => (
          <div key={question._id} className="mb-4">
            <p>{question.question}</p>
            {question.type === "text" && (
              <input
                type="text"
                className="border rounded p-2 w-full"
                onChange={(e) =>
                  handleAnswerChange(question.id, e.target.value)
                }
              />
            )}
            {question.type === "multiple-choice" && (
              <select
                multiple
                className="border rounded p-2 w-full"
                onChange={(e) =>
                  handleAnswerChange(
                    question.id,
                    Array.from(e.target.selectedOptions, (opt) => opt.value),
                  )
                }
              >
                {question.options.map((option: string, idx: number) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            {question.type === "checkbox" && (
              <div className="flex flex-wrap gap-2">
                {question.type === "checkbox" && (
                  <div className="flex flex-wrap gap-2">
                    {question.options.map((option: string, idx: number) => (
                      <label key={idx} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value={option}
                          onChange={(e) => {
                            const currentAnswers =
                              answers.find(
                                (ans) => ans.questionId === question.id,
                              )?.answer || [];

                            handleAnswerChange(
                              question.id,
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
            )}
          </div>
        ))}
        <div className="flex justify-between">
          <button className="btn" onClick={handleSubmit}>
            Submit
          </button>
          <button className="btn" onClick={onClose}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
