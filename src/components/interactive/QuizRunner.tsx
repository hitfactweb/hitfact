"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, Award, ArrowRight, RotateCcw, HelpCircle } from "lucide-react";

interface QuizOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  explanation: string;
  options: QuizOption[];
}

interface QuizRunnerProps {
  quiz: {
    id: string;
    title: string;
    description: string;
    passMark: number;
    questions: QuizQuestion[];
  };
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({ quiz }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, { optionId: string; isCorrect: boolean }>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = quiz.questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + (isFinished ? 1 : 0)) / quiz.questions.length) * 100);

  const handleSelectOption = (optionId: string) => {
    if (isAnswerRevealed) return;
    setSelectedOptionId(optionId);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOptionId || isAnswerRevealed) return;
    const chosenOption = currentQuestion.options.find((o) => o.id === selectedOptionId);
    const correct = Boolean(chosenOption?.isCorrect);

    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: { optionId: selectedOptionId, isCorrect: correct },
    }));

    setIsAnswerRevealed(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerRevealed(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswerRevealed(false);
    setUserAnswers({});
    setIsFinished(false);
  };

  const totalScore = Object.values(userAnswers).filter((a) => a.isCorrect).length;
  const scorePercent = Math.round((totalScore / quiz.questions.length) * 100);
  const passed = scorePercent >= quiz.passMark;

  return (
    <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-brand-border rounded-2xl p-6 sm:p-8 shadow-xs dark:shadow-2xl space-y-6 transition-colors">
      {/* Quiz Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span className="font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" /> Media Literacy Challenge
          </span>
          <span>
            {isFinished ? "Completed" : `Question ${currentIndex + 1} of ${quiz.questions.length}`}
          </span>
        </div>
        <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-950 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800">
          <div
            className="h-full bg-purple-500 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {!isFinished ? (
        /* Active Question UI */
        <div className="space-y-6">
          <h3 className="text-base sm:text-xl font-bold text-zinc-900 dark:text-white leading-relaxed">
            {currentQuestion.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let optionStyle =
                "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800/40";

              if (isSelected && !isAnswerRevealed) {
                optionStyle = "bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-900 dark:text-white font-bold";
              }

              if (isAnswerRevealed) {
                if (opt.isCorrect) {
                  optionStyle = "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-300 font-bold";
                } else if (isSelected && !opt.isCorrect) {
                  optionStyle = "bg-red-50 dark:bg-red-950/60 border-red-500 text-red-900 dark:text-red-300 font-bold";
                } else {
                  optionStyle = "bg-zinc-50/50 dark:bg-zinc-950/40 border-zinc-200/50 dark:border-zinc-800/50 text-zinc-400 dark:text-zinc-500 opacity-60";
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={isAnswerRevealed}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-3 transition-all ${optionStyle}`}
                >
                  <span className="flex-1">{opt.label}</span>
                  {isAnswerRevealed && opt.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  {isAnswerRevealed && isSelected && !opt.isCorrect && (
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box on Reveal */}
          {isAnswerRevealed && (
            <div className="p-4 bg-purple-50/60 dark:bg-zinc-950 border border-purple-200/80 dark:border-zinc-800 rounded-xl space-y-1.5 animate-slide-up">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 block">
                Forensic Explanation
              </span>
              <p className="text-xs text-zinc-800 dark:text-zinc-300 leading-relaxed">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end pt-2">
            {!isAnswerRevealed ? (
              <button
                disabled={!selectedOptionId}
                onClick={handleConfirmAnswer}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 bg-brand-red hover:bg-brand-redDark text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md"
              >
                <span>{currentIndex < quiz.questions.length - 1 ? "Next Scenario" : "View Results"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results Scorecard UI */
        <div className="text-center py-8 space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-500/50 flex items-center justify-center mx-auto text-purple-600 dark:text-purple-400">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Assessment Complete!</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              You correctly solved {totalScore} out of {quiz.questions.length} scenarios.
            </p>
          </div>

          <div className="inline-block p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
            <div className="text-4xl font-extrabold font-mono text-purple-600 dark:text-purple-400">{scorePercent}%</div>
            <span
              className={`inline-block mt-1 text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                passed
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400"
                  : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400"
              }`}
            >
              {passed ? "Media Literacy Verified" : "Needs Review"}
            </span>
          </div>

          <div>
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white text-xs font-bold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Challenge</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
