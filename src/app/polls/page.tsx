import React from "react";
import { prisma } from "@/lib/db";
import { PollWidget } from "@/components/interactive/PollWidget";
import { CheckSquare, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PollsPage() {
  const polls = await prisma.poll.findMany({
    include: {
      options: {
        include: {
          votes: true,
        },
        orderBy: { sortOrder: "asc" },
      },
      votes: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="space-y-3 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
          <CheckSquare className="w-4 h-4" />
          <span>Civic Engagement</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight font-headline">
          PUBLIC OPINION & POLICY POLLS
        </h1>
        <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
          Make your voice heard on critical debates concerning media regulation, civic technology, and political integrity. All votes are counted securely with duplicate detection.
        </p>
      </div>

      {/* Polls List */}
      {polls.length > 0 ? (
        <div className="space-y-6">
          {polls.map((poll) => {
            const totalVotes = poll.votes.length;
            const optionsWithVotes = poll.options.map((opt) => ({
              id: opt.id,
              label: opt.label,
              votesCount: opt.votes.length,
            }));

            return (
              <PollWidget
                key={poll.id}
                id={poll.id}
                question={poll.question}
                description={poll.description}
                options={optionsWithVotes}
                totalVotesCount={totalVotes}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center space-y-3 shadow-xs">
          <AlertCircle className="w-8 h-8 text-zinc-400 dark:text-zinc-500 mx-auto" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">No active polls</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
            There are currently no open polls. New civic surveys and topic votes created in the Admin Panel will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
