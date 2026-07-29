"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { toast } from "sonner";
import { speakText } from "@/lib/speech";

interface Question {
  question: string;
  type: "multiple_choice" | "fill_blank" | "translation" | "listening";
  options?: string[];
  correctAnswer: string;
  userAnswer?: string;
  isCorrect?: boolean;
  audioUrl?: string;
  imageUrl?: string;
  explanation: string;
}

interface QuizComponentProps {
  quizId: string;
  questions: Question[];
  onComplete?: (score: number, answers: string[]) => void;
}

export default function QuizComponent({
  quizId,
  questions,
  onComplete,
}: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [userInput, setUserInput] = useState("");

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (isLastQuestion) {
      // Calculate score
      let correctCount = 0;
      newAnswers.forEach((ans, i) => {
        if (ans === questions[i].correctAnswer) correctCount++;
      });
      const finalScore = (correctCount / questions.length) * 100;
      setScore(finalScore);
      setShowResult(true);

      // Submit to API
      submitQuiz(newAnswers, finalScore);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setUserInput("");
    }
  };

  const submitQuiz = async (finalAnswers: string[], finalScore: number) => {
    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId,
          answers: finalAnswers,
          timeSpent,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`کویز تەواو بوو! نمرە: ${finalScore.toFixed(0)}%`);
        if (data.progress) {
          toast.success(
            `Level: ${data.progress.level} | Streak: ${data.progress.streak} 🔥`
          );
        }
      }

      if (onComplete) onComplete(finalScore, finalAnswers);
    } catch (error) {
      console.error("Submit quiz error:", error);
    }
  };

  const handlePlayAudio = (text?: string) => {
    if (text) {
      speakText(text);
    }
  };

  if (showResult) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            🎉 کویز تەواو بوو!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-6xl font-bold text-purple-600 mb-4">
            {score.toFixed(0)}%
          </div>
          <p className="text-lg text-gray-600 mb-6">
            {score >= 80
              ? "زۆر باشە! کارێکی نایابە! 🌟"
              : score >= 60
              ? "باشە! بەردەوام بە! 👍"
              : "هەوڵ بدەوە! دەتوانیت باشتر بیت! 💪"}
          </p>

          <div className="space-y-4">
            {questions.map((q, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg ${
                  answers[i] === q.correctAnswer
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <p className="font-semibold">{q.question}</p>
                <p className="text-sm mt-1">
                  وەڵامی تۆ:{" "}
                  <span
                    className={
                      answers[i] === q.correctAnswer
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {answers[i]}
                  </span>
                </p>
                {answers[i] !== q.correctAnswer && (
                  <p className="text-sm text-green-600">
                    وەڵامی دروست: {q.correctAnswer}
                  </p>
                )}
                <p className="text-sm text-gray-600 mt-1">{q.explanation}</p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Button
            onClick={() => {
              setCurrentQuestion(0);
              setAnswers([]);
              setShowResult(false);
              setStartTime(Date.now());
            }}
          >
            دووبارە هەوڵبدەوە
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            پرسیاری {currentQuestion + 1} لە {questions.length}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePlayAudio(question.question)}
          >
            🔊 گوێگرتن
          </Button>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xl mb-6">{question.question}</p>

        {question.imageUrl && (
          <img
            src={question.imageUrl}
            alt="Question"
            className="w-full max-h-64 object-cover rounded-lg mb-6"
          />
        )}

        {question.type === "multiple_choice" && question.options && (
          <div className="space-y-3">
            {question.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(option)}
                className="w-full text-right p-4 border-2 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition"
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {question.type === "fill_blank" && (
          <div>
            <input
              type="text"
              className="w-full p-4 border-2 rounded-lg"
              placeholder="وەڵامەکەت بنووسە..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && userInput.trim()) {
                  handleAnswer(userInput.trim());
                }
              }}
            />
            <Button
              className="w-full mt-4"
              onClick={() => userInput.trim() && handleAnswer(userInput.trim())}
            >
              پشتڕاستکردنەوە
            </Button>
          </div>
        )}

        {question.type === "translation" && (
          <div>
            <textarea
              className="w-full p-4 border-2 rounded-lg"
              rows={3}
              placeholder="وەرگێڕانەکەت بنووسە..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <Button
              className="w-full mt-4"
              onClick={() => userInput.trim() && handleAnswer(userInput.trim())}
            >
              ناردنی وەرگێڕان
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
