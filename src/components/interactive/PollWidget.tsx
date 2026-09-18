"use client";

import React, { useState } from "react";
import { Check, CheckSquare, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface PollOption {
  id: string;
  label: string;
  votesCount?: number;
}

interface PollWidgetProps {
  id: string;
  question: string;
  description?: string | null;
  options: PollOption[];
  userVotedOptionId?: string | null;
  totalVotesCount?: number;
}

export const PollWidget: React.FC<PollWidgetProps> = ({
  id,
  question,
  description,
  options: initialOptions,
  userVotedOptionId = null,
  totalVotesCount = 0,
}) => {
  const { currentUser } = useAuth();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(userVotedOptionId);
  const [hasVoted, setHasVoted] = useState(Boolean(userVotedOptionId));
  const [options, setOptions] = useState(initialOptions);
  const [totalVotes, setTotalVotes] = useState(totalVotesCount);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async (optionId: string) => {
    if (hasVoted || isSubmitting) return;

    setIsSubmitting(true);
    setSelectedOptionId(optionId);
    setHasVoted(true);
    setTotalVotes((prev) => prev + 1);

    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === optionId
          ? { ...opt, votesCount: (opt.votesCount || 0) + 1 }
          : opt
      )
    );

    try {
      await fetch(`/api/v1/polls/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          optionId,
          userId: currentUser?.id || "guest_voter",
        }),
      });
    } catch {
      // Gracefully maintain optimistic state in UI
    } finally {
      setIsSubmitting(false);
    }
  };

  const isMalayalam = /[\u0D00-\u0D7F]/.test(
    question + (description || "") + options.map((o) => o.label).join("")
  );

  return (
    <div className={`bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-brand-border rounded-xl p-6 shadow-xs dark:shadow-xl space-y-4 transition-colors ${
      isMalayalam ? "font-malayalam" : ""
    }`}>
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            <CheckSquare className="w-4 h-4 shrink-0" />
            <span>{isMalayalam ? "സിവിക് ഒപ്പീനിയൻ പോൾ" : "Public Opinion Poll"}</span>
          </div>
          {isMalayalam && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-sans">
              മലയാളം (Anek Malayalam)
            </span>
          )}
        </div>
        <h3 className={`text-lg font-bold text-zinc-900 dark:text-white ${
          isMalayalam ? "font-malayalam leading-relaxed text-base sm:text-lg" : "leading-snug"
        }`}>
          {question}
        </h3>
        {description && (
          <p className={`text-xs text-zinc-600 dark:text-zinc-400 mt-1 ${
            isMalayalam ? "font-malayalam leading-relaxed" : ""
          }`}>
            {description}
          </p>
        )}
      </div>

      {/* Options List */}
      <div className="space-y-2.5">
        {options.map((opt) => {
          const votes = opt.votesCount || 0;
          const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
          const isSelected = selectedOptionId === opt.id;
          const optIsMalayalam = isMalayalam || /[\u0D00-\u0D7F]/.test(opt.label);

          return (
            <button
              key={opt.id}
              disabled={hasVoted}
              onClick={() => handleVote(opt.id)}
              className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm transition-all relative overflow-hidden group ${
                isSelected
                  ? "border-brand-red bg-brand-red/10 text-brand-red dark:text-white font-bold"
                  : hasVoted
                  ? "border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-950/60 text-zinc-700 dark:text-zinc-300"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/80 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-900 dark:text-zinc-200"
              } ${optIsMalayalam ? "font-malayalam leading-relaxed" : ""}`}
            >
              {/* Progress bar background on vote */}
              {hasVoted && (
                <div
                  className={`absolute inset-y-0 left-0 transition-all duration-700 ${
                    isSelected ? "bg-brand-red/20 dark:bg-brand-red/25" : "bg-zinc-200 dark:bg-zinc-800/50"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              )}

              {/* Option label & percentage */}
              <div className="relative z-10 flex items-center justify-between gap-4">
                <span className="flex items-center gap-2">
                  {isSelected && <Check className="w-4 h-4 text-brand-red shrink-0" />}
                  <span className={optIsMalayalam ? "font-malayalam" : ""}>{opt.label}</span>
                </span>
                {hasVoted && (
                  <span className="font-mono text-xs font-bold text-zinc-600 dark:text-zinc-400 shrink-0">
                    {percentage}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
        <span className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          {isMalayalam ? `${totalVotes} പ്രതികരണങ്ങൾ (votes)` : `${totalVotes} total responses`}
        </span>
        <span>
          {hasVoted
            ? isMalayalam
              ? "വോട്ട് രേഖപ്പെടുത്തി • തത്സമയ ഫലം"
              : "Vote recorded • Real-time tally"
            : isMalayalam
            ? "വോട്ട് ചെയ്യാൻ ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക"
            : "Select an option to vote"}
        </span>
      </div>
    </div>
  );
};
