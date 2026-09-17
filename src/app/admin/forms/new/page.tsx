"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FormInput,
  Plus,
  Trash2,
  Send,
  AlertCircle,
  FileText,
  ListFilter,
  Star,
  CheckSquare,
  Type,
  AlignLeft,
} from "lucide-react";

type FieldType = "TEXT" | "TEXTAREA" | "SELECT" | "RADIO" | "CHECKBOX" | "RATING";

interface FieldItem {
  label: string;
  fieldType: FieldType;
  placeholder: string;
  required: boolean;
  options: string[];
}

export default function NewFormPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"PUBLISHED" | "DRAFT">("PUBLISHED");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [fields, setFields] = useState<FieldItem[]>([
    {
      label: "Full Name or Anonymous Handle",
      fieldType: "TEXT",
      placeholder: "e.g. Citizen_441 or leave empty if anonymous",
      required: false,
      options: [],
    },
    {
      label: "Your Feedback or Civic Testimony",
      fieldType: "TEXTAREA",
      placeholder: "Provide detailed feedback or observations...",
      required: true,
      options: [],
    },
  ]);

  const handleAddField = () => {
    setFields((prev) => [
      ...prev,
      {
        label: "",
        fieldType: "TEXT",
        placeholder: "",
        required: false,
        options: ["Option 1", "Option 2"],
      },
    ]);
  };

  const handleRemoveField = (index: number) => {
    if (fields.length <= 1) return;
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, patch: Partial<FieldItem>) => {
    setFields((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const handleOptionChange = (fieldIdx: number, optIdx: number, val: string) => {
    setFields((prev) => {
      const next = [...prev];
      const opts = [...next[fieldIdx].options];
      opts[optIdx] = val;
      next[fieldIdx].options = opts;
      return next;
    });
  };

  const handleAddOption = (fieldIdx: number) => {
    setFields((prev) => {
      const next = [...prev];
      next[fieldIdx].options = [...next[fieldIdx].options, `Option ${next[fieldIdx].options.length + 1}`];
      return next;
    });
  };

  const handleRemoveOption = (fieldIdx: number, optIdx: number) => {
    setFields((prev) => {
      const next = [...prev];
      if (next[fieldIdx].options.length <= 1) return prev;
      next[fieldIdx].options = next[fieldIdx].options.filter((_, i) => i !== optIdx);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg("Please enter a title for the form or survey.");
      return;
    }

    if (!description.trim()) {
      setErrorMsg("Please provide a description explaining the survey objective.");
      return;
    }

    // Validate fields
    for (let i = 0; i < fields.length; i++) {
      const f = fields[i];
      if (!f.label.trim()) {
        setErrorMsg(`Field #${i + 1} requires a question/label.`);
        return;
      }
      if (["SELECT", "RADIO", "CHECKBOX"].includes(f.fieldType)) {
        const cleanOpts = f.options.filter((o) => o.trim().length > 0);
        if (cleanOpts.length < 2) {
          setErrorMsg(`Field #${i + 1} (${f.fieldType}) requires at least 2 non-empty options.`);
          return;
        }
      }
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          status,
          fields: fields.map((f, idx) => ({
            label: f.label.trim(),
            fieldType: f.fieldType,
            placeholder: f.placeholder.trim() || undefined,
            required: f.required,
            options: ["SELECT", "RADIO", "CHECKBOX"].includes(f.fieldType)
              ? f.options.filter((o) => o.trim().length > 0)
              : undefined,
            sortOrder: idx,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create civic form");
      }

      router.push("/admin/forms");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while creating the form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <Link
          href="/admin/forms"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Forms
        </Link>
        <span className="text-xs font-mono uppercase text-amber-600 dark:text-yellow-400 font-bold flex items-center gap-1.5">
          <FormInput className="w-4 h-4" /> New Dynamic Survey
        </span>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white font-headline">
          CREATE DYNAMIC FORM & SURVEY
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Build community questionnaires, public consultation forms, and citizen feedback portals.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 rounded-lg flex items-center gap-2.5 text-xs text-red-700 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Info Card */}
        <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xs space-y-5 transition-colors">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Survey Title <span className="text-brand-red">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Public Consultation: Algorithmic Accountability in Electoral Cycles"
              className="w-full text-sm font-semibold bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Context & Explanation <span className="text-brand-red">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain to citizens why this testimony is being gathered and how the results will be reported..."
              className="w-full text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Form Status:
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="text-xs font-semibold bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-900 dark:text-white"
            >
              <option value="PUBLISHED">PUBLISHED (Active & Collecting Submissions)</option>
              <option value="DRAFT">DRAFT (Hidden from Public)</option>
            </select>
          </div>
        </div>

        {/* Dynamic Fields Builder */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-zinc-900 dark:text-white font-headline flex items-center gap-2">
              <ListFilter className="w-4 h-4 text-amber-600 dark:text-yellow-400" />
              Dynamic Questions & Fields ({fields.length})
            </h2>
            <button
              type="button"
              onClick={handleAddField}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Field
            </button>
          </div>

          {fields.map((field, fIdx) => (
            <div
              key={fIdx}
              className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs space-y-4 transition-colors"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-yellow-400">
                  Field #{fIdx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveField(fIdx)}
                  disabled={fields.length <= 1}
                  className="text-xs text-zinc-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-30 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Field
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Field Label */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Question / Field Label <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={field.label}
                    onChange={(e) => handleFieldChange(fIdx, { label: e.target.value })}
                    placeholder="e.g. Which region do you currently reside in?"
                    className="w-full text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white"
                  />
                </div>

                {/* Field Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Input Type
                  </label>
                  <select
                    value={field.fieldType}
                    onChange={(e) =>
                      handleFieldChange(fIdx, {
                        fieldType: e.target.value as FieldType,
                        options: ["SELECT", "RADIO", "CHECKBOX"].includes(e.target.value)
                          ? field.options.length > 0
                            ? field.options
                            : ["Choice 1", "Choice 2"]
                          : [],
                      })
                    }
                    className="w-full text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white font-semibold"
                  >
                    <option value="TEXT">Short Text Input</option>
                    <option value="TEXTAREA">Paragraph / Narrative</option>
                    <option value="SELECT">Dropdown Single Choice</option>
                    <option value="RADIO">Radio Buttons Single Choice</option>
                    <option value="CHECKBOX">Checkboxes Multi-Choice</option>
                    <option value="RATING">Rating Scale (1-5)</option>
                  </select>
                </div>
              </div>

              {/* Placeholder & Required */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {field.fieldType !== "RATING" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                      Placeholder Hint <span className="text-zinc-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={field.placeholder}
                      onChange={(e) => handleFieldChange(fIdx, { placeholder: e.target.value })}
                      placeholder="e.g. Enter here..."
                      className="w-full text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-900 dark:text-white"
                    />
                  </div>
                )}

                <div className="flex items-center">
                  <label className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => handleFieldChange(fIdx, { required: e.target.checked })}
                      className="rounded border-zinc-300 dark:border-zinc-700 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-semibold">Required for submission</span>
                  </label>
                </div>
              </div>

              {/* Multi-option builder for SELECT, RADIO, CHECKBOX */}
              {["SELECT", "RADIO", "CHECKBOX"].includes(field.fieldType) && (
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                    Choices / Options:
                  </label>
                  <div className="space-y-2">
                    {field.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          required
                          value={opt}
                          onChange={(e) => handleOptionChange(fIdx, oIdx, e.target.value)}
                          placeholder={`Option ${oIdx + 1}`}
                          className="flex-1 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded px-2.5 py-1.5 text-zinc-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(fIdx, oIdx)}
                          disabled={field.options.length <= 1}
                          className="p-1 text-zinc-400 hover:text-red-600 disabled:opacity-30 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddOption(fIdx)}
                    className="inline-flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-semibold mt-1"
                  >
                    <Plus className="w-3 h-3" /> Add Choice
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/forms"
            className="px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Publishing Form..." : "Publish Dynamic Form"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
