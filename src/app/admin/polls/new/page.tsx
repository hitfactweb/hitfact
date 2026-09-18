"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckSquare,
  Plus,
  Trash2,
  Calendar,
  ShieldCheck,
  Send,
  Eye,
  AlertCircle,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function NewPollPage() {
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [requireLogin, setRequireLogin] = useState(false);
  const [endsAt, setEndsAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isMalayalam = /[\u0D00-\u0D7F]/.test(
    question + description + options.join("")
  );

  const loadMalayalamPreset = () => {
    setQuestion("സോഷ്യൽ മീഡിയയിലെ വ്യാജവാർത്തകൾ തടയാൻ കർശനമായ ഫാക്ട്-ചെക്കിംഗ് നിയമങ്ങൾ വേണമോ?");
    setDescription("ഡിജിറ്റൽ മാധ്യമങ്ങളിലെ വ്യാജ പ്രചാരണങ്ങളും ഡീപ്ഫേക്കുകളും തടയുന്നതിനുള്ള ജനകീയ അഭിപ്രായ സർവേ.");
    setOptions([
      "അതെ – കർശനമായ ഫാക്ട്-ചെക്കിംഗും ലേബലിംഗും നിർബന്ധമാക്കണം",
      "മാധ്യമങ്ങൾക്ക് സ്വയം നിയന്ത്രണം ഏർപ്പെടുത്തിയാൽ മതി",
      "നിയമങ്ങൾ മാധ്യമ സ്വാതന്ത്ര്യത്തെ തടസ്സപ്പെടുത്താൻ സാധ്യതയുണ്ട്",
    ]);
  };

  const handleAddOption = () => {
    setOptions((prev) => [...prev, ""]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, val: string) => {
    setOptions((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!question.trim()) {
      setErrorMsg("Please enter the poll question.");
      return;
    }

    const cleanOptions = options.map((o) => o.trim()).filter(Boolean);
    if (cleanOptions.length < 2) {
      setErrorMsg("Please provide at least 2 non-empty poll options.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          description: description.trim() || undefined,
          options: cleanOptions,
          allowMultiple,
          requireLogin,
          endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create poll");
      }

      router.push("/admin/polls");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong while creating the poll.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <Link
          href="/admin/polls"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Polls
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadMalayalamPreset}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>മലയാളം മാതൃക (Malayalam Preset)</span>
          </button>
          <span className="text-xs font-mono uppercase text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4" /> New Public Poll
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white font-headline">
            CREATE CIVIC OPINION POLL
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Publish a public opinion question to gather civic feedback with verified ballot counting.
          </p>
        </div>
        {isMalayalam && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Anek Malayalam Font Active</span>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 rounded-lg flex items-center gap-2.5 text-xs text-red-700 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Card */}
        <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xs space-y-5 transition-colors">
          {/* Question */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Poll Question <span className="text-brand-red">*</span>
            </label>
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. സോഷ്യൽ മീഡിയയിലെ വ്യാജവാർത്തകൾ തടയാൻ കർശന നിയമങ്ങൾ വേണമോ? / Should platforms be regulated?"
              className={`w-full text-sm font-semibold bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red ${
                isMalayalam || /[\u0D00-\u0D7F]/.test(question) ? "font-malayalam leading-relaxed text-base" : ""
              }`}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Context / Description <span className="text-zinc-400 lowercase font-normal">(optional)</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context or background details regarding this civic topic..."
              className={`w-full text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red ${
                isMalayalam || /[\u0D00-\u0D7F]/.test(description) ? "font-malayalam leading-relaxed" : ""
              }`}
            />
          </div>

          {/* Dynamic Options */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Poll Choices / Options <span className="text-brand-red">*</span>
              </label>
              <span className="text-[11px] text-zinc-500">Minimum 2 options</span>
            </div>

            <div className="space-y-2.5">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-[11px] font-bold text-zinc-600 dark:text-zinc-400 flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <input
                    type="text"
                    required
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                    className={`flex-1 text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand-red ${
                      isMalayalam || /[\u0D00-\u0D7F]/.test(opt) ? "font-malayalam leading-relaxed" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    disabled={options.length <= 2}
                    title="Remove this option"
                    className="p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddOption}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg text-xs font-semibold border border-zinc-200 dark:border-zinc-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Another Option
            </button>
          </div>

          {/* Configuration Settings */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 block">
                Voting Rules & Security
              </label>
              
              <label className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allowMultiple}
                  onChange={(e) => setAllowMultiple(e.target.checked)}
                  className="rounded border-zinc-300 dark:border-zinc-700 text-brand-red focus:ring-brand-red"
                />
                <span>Allow multiple selections per voter</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={requireLogin}
                  onChange={(e) => setRequireLogin(e.target.checked)}
                  className="rounded border-zinc-300 dark:border-zinc-700 text-brand-red focus:ring-brand-red"
                />
                <span>Require verified account login to cast ballot</span>
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 block">
                Poll Expiration Date <span className="text-zinc-400 lowercase font-normal">(optional)</span>
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-red"
                />
              </div>
              <p className="text-[11px] text-zinc-500">Leave blank for indefinite active voting.</p>
            </div>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500">
            <Eye className="w-3.5 h-3.5" /> Citizen UI Preview
          </div>
          <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-3 shadow-xs ${
            isMalayalam ? "font-malayalam" : ""
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>{isMalayalam ? "സിവിക് ഒപ്പീനിയൻ പോൾ" : "HITFACT Civic Pulse"}</span>
              </div>
              {isMalayalam && (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-sans">
                  Anek Malayalam
                </span>
              )}
            </div>
            <h3 className={`text-sm sm:text-base font-bold text-zinc-900 dark:text-white ${
              isMalayalam ? "font-malayalam leading-relaxed text-base" : ""
            }`}>
              {question.trim() || "Your poll question will appear here..."}
            </h3>
            {description.trim() && (
              <p className={`text-xs text-zinc-600 dark:text-zinc-400 ${
                isMalayalam ? "font-malayalam leading-relaxed" : ""
              }`}>
                {description.trim()}
              </p>
            )}
            <div className="space-y-2 pt-1">
              {options.filter(Boolean).map((opt, i) => (
                <div
                  key={i}
                  className={`p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center justify-between ${
                    isMalayalam || /[\u0D00-\u0D7F]/.test(opt) ? "font-malayalam leading-relaxed" : ""
                  }`}
                >
                  <span>{opt}</span>
                  <span className="text-[11px] text-zinc-400 font-mono">0%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/polls"
            className="px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-red hover:bg-brand-redDark disabled:opacity-50 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Publishing..." : "Publish Poll"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
