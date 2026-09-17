import React from "react";
import { prisma } from "@/lib/db";
import { QuizRunner } from "@/components/interactive/QuizRunner";
import { HelpCircle, AlertCircle, Award, ChevronRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function QuizzesPage({
  searchParams,
}: {
  searchParams?: { quizId?: string };
}) {
  const allQuizzes = await prisma.quiz.findMany({
    where: { published: true },
    include: {
      questions: {
        include: {
          options: true,
        },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const selectedQuizId = searchParams?.quizId;
  const activeQuiz =
    (selectedQuizId ? allQuizzes.find((q) => q.id === selectedQuizId) : null) ||
    allQuizzes[0] ||
    null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="space-y-3 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Interactive Civic Education</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight font-headline">
          MEDIA LITERACY & VERIFICATION QUIZZES
        </h1>
        <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
          Sharpen your ability to detect digital manipulation, algorithmic sockpuppets, deepfakes, and misleading framing through real-world forensic simulations.
        </p>
      </div>

      {/* Quiz Selector if multiple quizzes */}
      {allQuizzes.length > 1 && (
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Select A Challenge:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allQuizzes.map((q) => {
              const isSelected = activeQuiz?.id === q.id;
              return (
                <Link
                  key={q.id}
                  href={`/quizzes?quizId=${q.id}`}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-950 dark:text-white shadow-xs"
                      : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 hover:border-zinc-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold truncate">{q.title}</span>
                    <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-400 shrink-0">
                      {q.questions.length} Qs
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-1">
                    {q.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Quiz Runner */}
      {activeQuiz ? (
        <div className="space-y-4">
          <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">{activeQuiz.title}</h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">{activeQuiz.description}</p>
            </div>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono bg-purple-100 dark:bg-purple-950 px-2.5 py-1 rounded-lg shrink-0">
              Pass: {activeQuiz.passMark}%
            </span>
          </div>

          <QuizRunner quiz={activeQuiz} />
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center space-y-3 shadow-xs">
          <AlertCircle className="w-8 h-8 text-zinc-400 dark:text-zinc-500 mx-auto" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">No active challenges</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
            There are currently no active media literacy quizzes published. New challenges created in the Admin Panel will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
