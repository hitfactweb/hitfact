"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FormInput,
  PlusCircle,
  Trash2,
  Download,
  ArrowUpRight,
  ExternalLink,
  Users,
  AlertCircle,
} from "lucide-react";

interface FormField {
  id: string;
  fieldType: string;
  label: string;
  placeholder?: string | null;
  required: boolean;
}

interface FormSubmission {
  id: string;
  answersJson: string;
  createdAt: string | Date;
}

interface Form {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: string;
  fields: FormField[];
  submissions: FormSubmission[];
}

interface FormsListClientProps {
  initialForms: Form[];
}

export default function FormsListClient({ initialForms }: FormsListClientProps) {
  const [forms, setForms] = useState<Form[]>(initialForms);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the form:\n\n"${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/v1/forms/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete form");
      }
      setForms((prev) => prev.filter((f) => f.id !== id));
    } catch (err: any) {
      alert("Error deleting form: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportCSV = (form: Form) => {
    if (form.submissions.length === 0) {
      alert("No citizen submissions have been recorded for this form yet.");
      return;
    }

    try {
      // Extract headers from field labels
      const headers = ["Submission ID", "Date", ...form.fields.map((f) => `"${f.label.replace(/"/g, '""')}"`)];
      const rows = form.submissions.map((s) => {
        let answers: Record<string, any> = {};
        try {
          answers = JSON.parse(s.answersJson);
        } catch {}
        const rowValues = form.fields.map((f) => {
          const val = answers[f.id] ?? answers[f.label] ?? "";
          return `"${String(val).replace(/"/g, '""')}"`;
        });
        return [`"${s.id}"`, `"${new Date(s.createdAt).toISOString()}"`, ...rowValues].join(",");
      });

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${form.slug}-submissions.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      alert("Error exporting CSV: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white font-headline">
            DYNAMIC FORMS & CITIZEN SURVEYS
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
            Analyze public feedback, research surveys, and civic lead submissions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/forms/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-md"
          >
            <PlusCircle className="w-4 h-4" /> Create New Form
          </Link>
        </div>
      </div>

      {/* Forms List */}
      {forms.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center space-y-4 shadow-xs">
          <FormInput className="w-10 h-10 text-zinc-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">No forms created yet</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
              Gather direct civic testimony, public consultation feedback, and whistleblower leads with customizable forms.
            </p>
          </div>
          <Link
            href="/admin/forms/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" /> Create First Dynamic Form
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {forms.map((form) => (
            <div
              key={form.id}
              className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xs dark:shadow-lg space-y-4 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-600 dark:text-yellow-400">
                  <FormInput className="w-4 h-4" />
                  <span>{form.status} Form</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/forms/${form.slug}`}
                    target="_blank"
                    className="text-xs text-brand-red hover:text-brand-redLight font-bold flex items-center gap-1 mr-2"
                  >
                    Live View <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => handleExportCSV(form)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold rounded border border-zinc-300 dark:border-zinc-700 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Export CSV
                  </button>
                  <button
                    onClick={() => handleDelete(form.id, form.title)}
                    disabled={deletingId === form.id}
                    className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 transition-colors rounded hover:bg-red-50 dark:hover:bg-red-950/40"
                    title="Delete Form"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{form.title}</h2>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{form.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">
                    Active Fields ({form.fields.length})
                  </span>
                  <ul className="text-xs space-y-1.5 text-zinc-800 dark:text-zinc-300">
                    {form.fields.map((f) => (
                      <li key={f.id} className="flex items-center justify-between">
                        <span className="truncate mr-2">{f.label}</span>
                        <span className="text-[10px] font-mono bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-400 shrink-0">
                          {f.fieldType}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 flex flex-col justify-center text-center">
                  <span className="text-3xl font-mono font-extrabold text-zinc-900 dark:text-white">
                    {form.submissions.length}
                  </span>
                  <span className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold mt-1">
                    Verified Citizen Submissions
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
