"use client";

import React, { useState } from "react";
import { ShieldCheck, CheckCircle2, Trash2, Ban, EyeOff, Check } from "lucide-react";

interface ModerationItem {
  id: string;
  author: string;
  postTitle: string;
  content: string;
  reason: string;
  date: string;
  status: "PENDING" | "APPROVED" | "HIDDEN" | "DELETED";
}

export default function AdminModerationPage() {
  const [items, setItems] = useState<ModerationItem[]>([]);

  const handleAction = (id: string, newStatus: "APPROVED" | "HIDDEN" | "DELETED") => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white font-headline">
          COMMUNITY SAFETY & MODERATION QUEUE
        </h1>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          Enforce editorial integrity, anti-spam filters, harassment mitigation, and account bans.
        </p>
      </div>

      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-xl border bg-white dark:bg-zinc-900/90 border-amber-500/40 space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 uppercase">
                  Flagged: {item.reason}
                </span>
                <span className="text-[11px] text-zinc-500">{item.date}</span>
              </div>
              <blockquote className="p-3 rounded-lg bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 font-mono">
                {item.content}
              </blockquote>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleAction(item.id, "APPROVED")}
                  className="px-3 py-1.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(item.id, "DELETED")}
                  className="px-3 py-1.5 rounded bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 text-xs font-bold transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center space-y-3 shadow-xs">
          <ShieldCheck className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">Moderation Queue Clear</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
            There are no pending reports or flagged comments at this time. Flagged user comments will automatically appear here for review.
          </p>
        </div>
      )}
    </div>
  );
}
