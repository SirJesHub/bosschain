import React, { useState } from "react";
import "./QuizForm.css"; // Import your CSS file for styling
import toast from "react-hot-toast";
import { EnrollmentService } from "@/lib/supabase/enrollmentRequests";
import { json } from "stream/consumers";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRoleContext } from "@/context/roleContext";

interface Answer {
  id: string;
  text: string;
}

interface QuizQuestion {
  question: string;
  questionType: string;
  questionPic?: string;
  answerSelectionType: string;
  answers: Answer[];
  correctAnswer: string; // Changed to string
  messageForCorrectAnswer: string;
  messageForIncorrectAnswer: string;
  explanation: string;
  point: string;
}

interface Quiz {
  quizTitle: string;
  quizSynopsis: string;
  nrOfQuestions: string;
  questions: QuizQuestion[];
}

const initialQuiz: Quiz = {
  quizTitle: "",
  quizSynopsis: "",
  nrOfQuestions: "0",
  questions: [],
};

const QuizForm: React.FC = () => {
  const [quiz, setQuiz] = useState<Quiz>(initialQuiz);
  const [token, setToken] = useState<string>("");
  const { isLoaded, userId: maybeUserId, sessionId, getToken } = useAuth();
  const userId = maybeUserId || "";
  const { role } = useRoleContext();
  const { user, isSignedIn } = useUser();

  const handleQuestionChange = (
    index: number,
    field: keyof QuizQuestion,
    value: any,
  ) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index][field] = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleAnswerChange = (
    questionIndex: number,
    answerIndex: number,
    value: string,
  ) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex].answers[answerIndex].text = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleCorrectAnswerChange = (
    questionIndex: number,
    correctAnswerId: string,
  ) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex].correctAnswer = correctAnswerId;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const addAnswer = (questionIndex: number) => {
    const updatedQuestions = [...quiz.questions];
    const lastAnswer =
      updatedQuestions[questionIndex].answers[
        updatedQuestions[questionIndex].answers.length - 1
      ];
    const nextId = lastAnswer ? (parseInt(lastAnswer.id) + 1).toString() : "1"; // Check if lastAnswer exists
    updatedQuestions[questionIndex].answers.push({ id: nextId, text: "" });
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const removeAnswer = (questionIndex: number, answerIndex: number) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex].answers.splice(answerIndex, 1);
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      nrOfQuestions: (parseInt(quiz.nrOfQuestions) + 1).toString(),
      questions: [
        ...quiz.questions,
        {
          question: "",
          questionType: "text",
          answerSelectionType: "single",
          answers: [{ id: "1", text: "" }],
          correctAnswer: "",
          messageForCorrectAnswer: "",
          messageForIncorrectAnswer: "",
          explanation: "",
          point: "1",
        },
      ],
    });
  };

  const deleteQuestion = (questionIndex: number) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions.splice(questionIndex, 1);
    setQuiz({
      ...quiz,
      nrOfQuestions: (parseInt(quiz.nrOfQuestions) - 1).toString(),
      questions: updatedQuestions,
    });
  };

  const outputJSON = async () => {
    const output = {
      quizTitle: quiz.quizTitle,
      quizSynopsis: quiz.quizSynopsis,
      nrOfQuestions: quiz.questions.length.toString(),
      questions: quiz.questions.map((question) => ({
        question: question.question,
        questionType: question.questionType,
        answerSelectionType: question.answerSelectionType,
        answers: question.answers.map((answer) => answer.text),
        correctAnswer: question.correctAnswer,
        messageForCorrectAnswer: question.messageForCorrectAnswer,
        messageForIncorrectAnswer: question.messageForIncorrectAnswer,
        explanation: question.explanation,
        point: question.point,
      })),
    };
    console.log(JSON.stringify(output, null, 2));

    const jsonString = JSON.stringify(output, null, 2);
    const token = await getToken({ template: "supabase" });
    const lessonId = window.location.pathname.split("/").pop() || "";

    try {
      if (!token) {
        throw new Error("Token is missing");
      }
      const data = await EnrollmentService.updateLessonQuiz({
        lessonId: Number(lessonId),
        userId,
        content: jsonString,
        token,
      });

      if (data.error) {
        console.log(data.error);
        toast.error("Something went wrong. Please try again"); // Display error message to user
        return;
      } else {
        // Success case, handle as needed

        console.log("Lesson quiz updated successfully!");
        toast.success("Lesson quiz updated successfully!");

        //onQuizContentUpdate(jsonString);
        console.log("jsong string after onQuizContentUpdate" + jsonString);
      }
    } catch (error) {
      console.error("[updateLessonQuizComponent ERROR]: ", error);
      toast.error("Something went wrong while updating lesson quiz.");
    }

    /*
    navigator.clipboard.writeText(jsonString)
    .then(() => {
      console.log('JSON copied to clipboard:', jsonString);
      // Optionally, you can provide feedback to the user
      toast.success('JSON copied to clipboard!');
    })
    .catch((error) => {
      console.error('Failed to copy JSON to clipboard:', error);
      // Optionally, you can provide feedback to the user
      toast.error('Failed to copy JSON to clipboard.');
    });

*/
  };

  return (
    <div className="quiz-form-container">
      <div>
        <label className="quiz-label">Quiz Title:</label>
        <input
          type="text"
          className="quiz-input"
          value={quiz.quizTitle}
          onChange={(e) => setQuiz({ ...quiz, quizTitle: e.target.value })}
        />
      </div>
      <div>
        <label className="quiz-label">Quiz Synopsis:</label>
        <textarea
          className="quiz-textarea"
          value={quiz.quizSynopsis}
          onChange={(e) => setQuiz({ ...quiz, quizSynopsis: e.target.value })}
        />
      </div>
      <hr className="separator" /> {/* Horizontal line as separator */}
      {quiz.questions.map((question, questionIndex) => (
        <div key={questionIndex} className="question-container">
          <div>
            <label className="quiz-label">{`Question ${questionIndex + 1}:`}</label>
            <input
              type="text"
              className="quiz-input"
              value={question.question}
              onChange={(e) =>
                handleQuestionChange(questionIndex, "question", e.target.value)
              }
            />
          </div>
          {question.answers.map((answer, answerIndex) => (
            <div key={answer.id} className="answer-container">
              <label
                htmlFor={`question${questionIndex}-answer${answerIndex}`}
                className="quiz-label"
              >{`Answer ${answerIndex + 1}`}</label>
              <input
                type="text"
                className="quiz-input"
                value={answer.text}
                onChange={(e) =>
                  handleAnswerChange(questionIndex, answerIndex, e.target.value)
                }
                style={{ marginLeft: "10px" }}
              />
              <button
                type="button"
                className={`select-answer-button ${question.correctAnswer === answer.id ? "clicked" : ""}`}
                onClick={() =>
                  handleCorrectAnswerChange(questionIndex, answer.id)
                }
                style={{ marginRight: "10px" }}
              >
                Correct Answer
              </button>
              <button
                type="button"
                className="remove-answer-button"
                onClick={() => removeAnswer(questionIndex, answerIndex)}
              >
                Remove Answer
              </button>
            </div>
          ))}
          <button
            type="button"
            className="add-answer-button"
            onClick={() => addAnswer(questionIndex)}
            style={{ marginRight: "10px" }}
          >
            Add Answer
          </button>
          <button
            type="button"
            className="delete-question-button"
            onClick={() => deleteQuestion(questionIndex)}
          >
            Delete Question
          </button>{" "}
          {/* Delete button */}
          {/* Other fields of the question */}
        </div>
      ))}
      <hr className="separator" /> {/* Horizontal line as separator */}
      <div className="centered-buttons">
        <button
          type="button"
          className="add-question-button"
          onClick={addQuestion}
        >
          Add Question
        </button>
        <div style={{ marginTop: "20px" }}>
          <button
            type="button"
            className="output-json-button"
            onClick={outputJSON}
          >
            Update Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizForm;
