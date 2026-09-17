"use client";

import React, { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import { FileText, CheckCircle2, Send, ShieldCheck, ChevronLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface FormField {
  id: string;
  fieldType: string;
  label: string;
  placeholder?: string | null;
  required: boolean;
  optionsJson?: string | null;
}

interface FormData {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}

export default function FormPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { currentUser } = useAuth();

  const [form, setForm] = useState<FormData | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/forms/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.form) {
          setForm(data.form);
        } else {
          setForm(null);
        }
      })
      .catch(() => setForm(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="p-12 text-center text-zinc-500 text-xs">Loading form...</div>;
  }

  if (!form) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-zinc-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Form Not Found</h2>
        <p className="text-xs text-zinc-400">
          This form or survey either does not exist or has been archived by the editorial team.
        </p>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-bold transition-colors"
        >
          Return to Feed
        </Link>
      </div>
    );
  }

  const handleChange = (fieldId: string, val: any) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/v1/forms/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          userId: currentUser?.id,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "Failed to submit response");
        return;
      }
      setIsSubmitted(true);
    } catch (err: any) {
      alert("Error submitting form: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Home
      </Link>

      {!isSubmitted ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-brand-border rounded-2xl p-6 sm:p-8 shadow-xs dark:shadow-2xl space-y-6 transition-colors"
        >
          <div className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-yellow-400">
              <FileText className="w-4 h-4" />
              <span>Independent Public Research</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white leading-snug">
              {form.title}
            </h1>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">{form.description}</p>
          </div>

          <div className="space-y-5">
            {form.fields.map((field) => {
              const options: string[] = field.optionsJson ? JSON.parse(field.optionsJson) : [];

              return (
                <div key={field.id} className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    {field.label}
                    {field.required && <span className="text-brand-red ml-1">*</span>}
                  </label>

                  {field.fieldType === "TEXT" && (
                    <input
                      type="text"
                      required={field.required}
                      placeholder={field.placeholder || ""}
                      value={answers[field.id] || ""}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-3 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand-red focus:bg-white dark:focus:bg-zinc-950"
                    />
                  )}

                  {field.fieldType === "TEXTAREA" && (
                    <textarea
                      rows={3}
                      required={field.required}
                      placeholder={field.placeholder || ""}
                      value={answers[field.id] || ""}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-3 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand-red focus:bg-white dark:focus:bg-zinc-950 resize-none"
                    />
                  )}

                  {field.fieldType === "SELECT" && (
                    <select
                      required={field.required}
                      value={answers[field.id] || ""}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-3 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand-red focus:bg-white dark:focus:bg-zinc-950"
                    >
                      <option value="">Select an answer...</option>
                      {options.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}

                  {field.fieldType === "RATING" && (
                    <div className="flex items-center gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          type="button"
                          key={score}
                          onClick={() => handleChange(field.id, score)}
                          className={`w-10 h-10 rounded-lg border text-sm font-bold flex items-center justify-center transition-all ${
                            answers[field.id] === score
                              ? "bg-brand-red border-brand-red text-white"
                              : "bg-zinc-100 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-white"
                          }`}
                        >
                          {score}
                        </button>
                      ))}
                      <span className="text-[11px] text-zinc-500 ml-2">
                        {answers[field.id] ? `Rating: ${answers[field.id]}/5` : "(1 = Lowest, 5 = Highest)"}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800/80 flex items-center gap-2 text-[11px] text-zinc-600 dark:text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              Responses are strictly confidential and analyzed in aggregate for public-interest research.
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-brand-red hover:bg-brand-redDark disabled:opacity-50 text-white rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? "Submitting..." : "Submit Confidential Response"}</span>
          </button>
        </form>
      ) : (
        <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-brand-border rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-xs dark:shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Response Recorded</h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 max-w-md mx-auto leading-relaxed">
            Thank you for contributing to civic media accountability. Your response has been securely logged with the HITFACT research desk.
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-block px-5 py-2.5 rounded-lg bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white text-xs font-bold transition-colors"
            >
              Return to Feed
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
