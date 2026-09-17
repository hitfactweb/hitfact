"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckSquare,
  PlusCircle,
  Trash2,
  ExternalLink,
  Users,
  Calendar,
  AlertCircle,
} from "lucide-react";

interface PollOption {
  id: string;
  label: string;
  votes: { id: string }[];
}

interface Poll {
  id: string;
  question: string;
  description: string | null;
  allowMultiple: boolean;
  requireLogin: boolean;
  endsAt: string | Date | null;
  createdAt: string | Date;
  options: PollOption[];
  votes: { id: string }[];
}

interface PollsListClientProps {
  initialPolls: Poll[];
}

export default function PollsListClient({ initialPolls }: PollsListClientProps) {
  const [polls, setPolls] = useState<Poll[]>(initialPolls);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, question: string) => {
    if (!confirm(`Are you sure you want to permanently delete this poll:\n\n"${question}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/v1/polls/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete poll");
      }
      setPolls((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert("Error deleting poll: " + err.message);
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
            POLL & CIVIC VOICE MANAGER
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
            Monitor public opinion polls, voting distribution, and ballot audit logs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/polls"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Public View
          </Link>
          <Link
            href="/admin/polls/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-red hover:bg-brand-redDark text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-md"
          >
            <PlusCircle className="w-4 h-4" /> Create New Poll
          </Link>
        </div>
      </div>

      {/* Poll Cards */}
      {polls.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center space-y-4 shadow-xs">
          <CheckSquare className="w-10 h-10 text-zinc-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">No polls created yet</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
              Engage your community by asking critical public questions and tracking real-time public opinion.
            </p>
          </div>
          <Link
            href="/admin/polls/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red hover:bg-brand-redDark text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" /> Create Your First Poll
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {polls.map((poll) => {
            const totalVotes = poll.votes?.length || 0;

            return (
              <div
                key={poll.id}
                className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xs dark:shadow-lg space-y-4 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-blue-600 dark:text-blue-400">
                    <CheckSquare className="w-4 h-4" />
                    <span>Public Poll</span>
                    {poll.allowMultiple && (
                      <span className="text-[10px] bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded text-blue-700 dark:text-blue-300 font-semibold normal-case">
                        Multiple Choice
                      </span>
                    )}
                    {poll.requireLogin && (
                      <span className="text-[10px] bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded text-purple-700 dark:text-purple-300 font-semibold normal-case">
                        Login Required
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                      {totalVotes} {totalVotes === 1 ? "Vote" : "Votes"}
                    </span>
                    <button
                      onClick={() => handleDelete(poll.id, poll.question)}
                      disabled={deletingId === poll.id}
                      className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 transition-colors rounded hover:bg-red-50 dark:hover:bg-red-950/40"
                      title="Delete Poll"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                    {poll.question}
                  </h2>
                  {poll.description && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{poll.description}</p>
                  )}
                </div>

                {/* Tally Breakdown */}
                <div className="space-y-2 pt-1">
                  {poll.options.map((opt) => {
                    const votesCount = opt.votes?.length || 0;
                    const pct = totalVotes > 0 ? Math.round((votesCount / totalVotes) * 100) : 0;

                    return (
                      <div
                        key={opt.id}
                        className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-1.5"
                      >
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-800 dark:text-zinc-200 font-medium">{opt.label}</span>
                          <span className="font-mono font-bold text-zinc-900 dark:text-white">
                            {votesCount} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-red rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
