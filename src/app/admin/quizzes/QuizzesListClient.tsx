"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  PlusCircle,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Award,
  ArrowUpRight,
  Clock,
  AlertCircle,
} from "lucide-react";

interface Option {
  id: string;
  label: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  question: string;
  explanation: string;
  options: Option[];
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  slug: string;
  passMark: number;
  timeLimit: number | null;
  published: boolean;
  questions: Question[];
  attempts: { id: string }[];
}

interface QuizzesListClientProps {
  initialQuizzes: Quiz[];
}

export default function QuizzesListClient({ initialQuizzes }: QuizzesListClientProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the quiz:\n\n"${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/v1/quizzes/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete quiz");
      }
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
    } catch (err: any) {
      alert("Error deleting quiz: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white font-headline">
            MEDIA LITERACY QUIZ MANAGER
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
            Review curriculum scenarios, question explanations, and citizen completion metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/quizzes"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Public View
          </Link>
          <Link
            href="/admin/quizzes/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-md"
          >
            <PlusCircle className="w-4 h-4" /> Create New Quiz
          </Link>
        </div>
      </div>

      {/* Quizzes List */}
      {quizzes.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center space-y-4 shadow-xs">
          <HelpCircle className="w-10 h-10 text-zinc-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">No quizzes created yet</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
              Train citizens to spot propaganda and digital deception by creating forensic media literacy challenges.
            </p>
          </div>
          <Link
            href="/admin/quizzes/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" /> Create First Quiz Challenge
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xs dark:shadow-lg space-y-4 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-purple-600 dark:text-purple-400">
                  <HelpCircle className="w-4 h-4" />
                  <span>{quiz.published ? "Published Educational Challenge" : "Draft Challenge"}</span>
                  <span className="text-[10px] bg-purple-100 dark:bg-purple-950/60 px-2 py-0.5 rounded text-purple-700 dark:text-purple-300 font-semibold normal-case">
                    Pass: {quiz.passMark}%
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/quizzes?quizId=${quiz.id}`}
                    target="_blank"
                    className="text-xs text-brand-red hover:text-brand-redLight font-bold flex items-center gap-1"
                  >
                    Play Challenge <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(quiz.id, quiz.title)}
                    disabled={deletingId === quiz.id}
                    className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 transition-colors rounded hover:bg-red-50 dark:hover:bg-red-950/40"
                    title="Delete Quiz"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{quiz.title}</h2>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{quiz.description}</p>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                  Scenario Questions ({quiz.questions.length})
                </span>
                {quiz.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-2"
                  >
                    <p className="text-xs font-bold text-zinc-900 dark:text-white">
                      {idx + 1}. {q.question}
                    </p>
                    <div className="pl-3 border-l-2 border-zinc-200 dark:border-zinc-800 space-y-1 text-xs">
                      {q.options.map((opt) => (
                        <div
                          key={opt.id}
                          className={`flex items-center gap-1.5 ${
                            opt.isCorrect
                              ? "text-emerald-600 dark:text-emerald-400 font-bold"
                              : "text-zinc-600 dark:text-zinc-400"
                          }`}
                        >
                          {opt.isCorrect && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                          <span>{opt.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
