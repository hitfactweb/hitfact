"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle2,
  Send,
  AlertCircle,
  Award,
  Clock,
  Sparkles,
} from "lucide-react";

interface OptionState {
  label: string;
  isCorrect: boolean;
}

interface QuestionState {
  question: string;
  explanation: string;
  options: OptionState[];
}

export default function NewQuizPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [passMark, setPassMark] = useState(70);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState("");
  const [published, setPublished] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [questions, setQuestions] = useState<QuestionState[]>([
    {
      question: "",
      explanation: "",
      options: [
        { label: "", isCorrect: true },
        { label: "", isCorrect: false },
      ],
    },
  ]);

  // Question manipulation
  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: "",
        explanation: "",
        options: [
          { label: "", isCorrect: true },
          { label: "", isCorrect: false },
        ],
      },
    ]);
  };

  const handleRemoveQuestion = (qIndex: number) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== qIndex));
  };

  const handleQuestionChange = (qIndex: number, field: "question" | "explanation", val: string) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[qIndex] = { ...next[qIndex], [field]: val };
      return next;
    });
  };

  // Option manipulation
  const handleAddOption = (qIndex: number) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[qIndex].options.push({ label: "", isCorrect: false });
      return next;
    });
  };

  const handleRemoveOption = (qIndex: number, optIndex: number) => {
    setQuestions((prev) => {
      const next = [...prev];
      if (next[qIndex].options.length <= 2) return prev;
      next[qIndex].options = next[qIndex].options.filter((_, i) => i !== optIndex);
      // Ensure at least one is correct
      if (!next[qIndex].options.some((o) => o.isCorrect)) {
        next[qIndex].options[0].isCorrect = true;
      }
      return next;
    });
  };

  const handleOptionLabelChange = (qIndex: number, optIndex: number, val: string) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[qIndex].options[optIndex].label = val;
      return next;
    });
  };

  const handleSetCorrectOption = (qIndex: number, optIndex: number) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[qIndex].options = next[qIndex].options.map((opt, i) => ({
        ...opt,
        isCorrect: i === optIndex,
      }));
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg("Please enter a challenge title.");
      return;
    }

    if (!description.trim()) {
      setErrorMsg("Please provide a curriculum description.");
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setErrorMsg(`Question ${i + 1} prompt cannot be empty.`);
        return;
      }
      if (!q.explanation.trim()) {
        setErrorMsg(`Question ${i + 1} requires a forensic explanation for citizens.`);
        return;
      }
      const validOptions = q.options.filter((o) => o.label.trim().length > 0);
      if (validOptions.length < 2) {
        setErrorMsg(`Question ${i + 1} must have at least 2 filled answer choices.`);
        return;
      }
      if (!validOptions.some((o) => o.isCorrect)) {
        setErrorMsg(`Question ${i + 1} must have one option marked as the correct answer.`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          passMark: Number(passMark),
          timeLimit: timeLimitMinutes ? Number(timeLimitMinutes) * 60 : undefined,
          published,
          questions: questions.map((q, idx) => ({
            question: q.question.trim(),
            explanation: q.explanation.trim(),
            sortOrder: idx,
            options: q.options
              .filter((o) => o.label.trim().length > 0)
              .map((o) => ({
                label: o.label.trim(),
                isCorrect: o.isCorrect,
              })),
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create quiz challenge");
      }

      router.push("/admin/quizzes");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <Link
          href="/admin/quizzes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Quizzes
        </Link>
        <span className="text-xs font-mono uppercase text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4" /> New Media Literacy Challenge
        </span>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white font-headline">
          CREATE MEDIA LITERACY QUIZ
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Build interactive scenario exercises with real-world verification forensic breakdowns.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 rounded-lg flex items-center gap-2.5 text-xs text-red-700 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Quiz Details */}
        <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xs space-y-5 transition-colors">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Challenge Title <span className="text-brand-red">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Identifying AI Voice Clones & Synthetic Leaks"
              className="w-full text-sm font-semibold bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Description & Learning Objective <span className="text-brand-red">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what forensic skills citizens will learn through this challenge..."
              className="w-full text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                Pass Mark (%)
              </label>
              <input
                type="number"
                min={10}
                max={100}
                value={passMark}
                onChange={(e) => setPassMark(Number(e.target.value))}
                className="w-full text-xs sm:text-sm font-mono bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                Time Limit (Minutes)
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(e.target.value)}
                placeholder="Optional (e.g. 5)"
                className="w-full text-xs sm:text-sm font-mono bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600"
              />
            </div>

            <div className="space-y-1.5 flex flex-col justify-end">
              <label className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer select-none py-2">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="rounded border-zinc-300 dark:border-zinc-700 text-purple-600 focus:ring-purple-500"
                />
                <span className="font-semibold">Publish to public website immediately</span>
              </label>
            </div>
          </div>
        </div>

        {/* Dynamic Question Scenarios */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-zinc-900 dark:text-white font-headline flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Scenario Questions ({questions.length})
            </h2>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Scenario Question
            </button>
          </div>

          {questions.map((q, qIdx) => (
            <div
              key={qIdx}
              className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xs space-y-4 relative transition-colors"
            >
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Scenario #{qIdx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(qIdx)}
                  disabled={questions.length <= 1}
                  className="text-xs text-zinc-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-30 disabled:hover:text-zinc-400 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Scenario
                </button>
              </div>

              {/* Prompt Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Question Prompt / Dilemma <span className="text-brand-red">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIdx, "question", e.target.value)}
                  placeholder="e.g. A viral clip shows a candidate making a shocking statement. The lip movements don't match the audio rhythm. What should be your first forensic step?"
                  className="w-full text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              {/* Forensic Explanation */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Forensic Explanation (Revealed when answered) <span className="text-brand-red">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={q.explanation}
                  onChange={(e) => handleQuestionChange(qIdx, "explanation", e.target.value)}
                  placeholder="Explain why the correct answer is factually correct, citing forensic verification methods..."
                  className="w-full text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-950 border border-purple-200 dark:border-purple-900/50 rounded-lg p-3 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Choices (Select the Radio button for the Correct Answer) <span className="text-brand-red">*</span>
                  </label>
                  <span className="text-[11px] text-zinc-500">Min 2 choices</span>
                </div>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      className={`flex items-center gap-2.5 p-2 rounded-lg border transition-colors ${
                        opt.isCorrect
                          ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800"
                          : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleSetCorrectOption(qIdx, optIdx)}
                        title={opt.isCorrect ? "Correct Answer" : "Click to mark as correct answer"}
                        className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                          opt.isCorrect
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-zinc-400 hover:border-emerald-500"
                        }`}
                      >
                        {opt.isCorrect && <CheckCircle2 className="w-4 h-4" />}
                      </button>

                      <input
                        type="text"
                        required
                        value={opt.label}
                        onChange={(e) => handleOptionLabelChange(qIdx, optIdx, e.target.value)}
                        placeholder={`Choice ${optIdx + 1}`}
                        className="flex-1 text-xs sm:text-sm bg-transparent border-none px-2 py-1 text-zinc-900 dark:text-white focus:outline-none"
                      />

                      {opt.isCorrect && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded shrink-0">
                          Correct Answer
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveOption(qIdx, optIdx)}
                        disabled={q.options.length <= 2}
                        className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleAddOption(qIdx)}
                  className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded text-xs font-semibold border border-zinc-200 dark:border-zinc-700 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add Choice
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/quizzes"
            className="px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Saving Challenge..." : "Publish Quiz Challenge"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
