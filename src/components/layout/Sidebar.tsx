"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, ShieldCheck, ArrowUpRight, CheckSquare, HelpCircle, ArrowRight } from "lucide-react";
import { FactCheckBadge } from "@/components/feed/FactCheckBadge";
import { PollWidget } from "@/components/interactive/PollWidget";

interface LatestFactCheck {
  id: string;
  slug: string;
  title: string;
  verdict: string;
  claim: string;
}

interface ActivePoll {
  id: string;
  question: string;
  description: string | null;
  options: {
    id: string;
    label: string;
    votesCount?: number;
  }[];
  totalVotesCount: number;
}

interface ActiveQuiz {
  id: string;
  title: string;
  description: string;
  slug: string;
  passMark: number;
  questionCount: number;
}

export const Sidebar: React.FC = () => {
  const [latestChecks, setLatestChecks] = useState<LatestFactCheck[]>([]);
  const [activePoll, setActivePoll] = useState<ActivePoll | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<ActiveQuiz | null>(null);

  useEffect(() => {
    // 1. Fetch latest fact checks
    fetch("/api/v1/posts?type=FACT_CHECK&limit=3")
      .then((res) => res.json())
      .then((data) => {
        if (data.posts && Array.isArray(data.posts)) {
          setLatestChecks(
            data.posts.map((p: any) => ({
              id: p.id,
              slug: p.slug,
              title: p.title,
              verdict: p.factCheck?.verdict || "UNVERIFIED",
              claim: p.factCheck?.claim || p.title,
            }))
          );
        }
      })
      .catch(() => {});

    // 2. Fetch active civic poll
    fetch("/api/v1/polls")
      .then((res) => res.json())
      .then((data) => {
        if (data.polls && Array.isArray(data.polls) && data.polls.length > 0) {
          const p = data.polls[0];
          setActivePoll({
            id: p.id,
            question: p.question,
            description: p.description,
            options: (p.options || []).map((o: any) => ({
              id: o.id,
              label: o.label,
              votesCount: o.votes?.length || 0,
            })),
            totalVotesCount: p.votes?.length || 0,
          });
        }
      })
      .catch(() => {});

    // 3. Fetch active quiz
    fetch("/api/v1/quizzes")
      .then((res) => res.json())
      .then((data) => {
        if (data.quizzes && Array.isArray(data.quizzes) && data.quizzes.length > 0) {
          const q = data.quizzes[0];
          setActiveQuiz({
            id: q.id,
            title: q.title,
            description: q.description,
            slug: q.slug,
            passMark: q.passMark,
            questionCount: q.questions?.length || 0,
          });
        }
      })
      .catch(() => {});
  }, []);

  const desks = [
    { name: "Politics", slug: "politics" },
    { name: "Media", slug: "media" },
    { name: "Reality Check", slug: "reality-check" },
    { name: "Economy", slug: "economy" },
    { name: "Science & AI", slug: "science-ai" },
  ];

  return (
    <aside className="space-y-6">
      {/* Fact Check Archive Card */}
      <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-brand-border rounded-2xl p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-red" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
              Fact Check Archive
            </span>
          </div>
          <Link
            href="/fact-checks"
            className="text-[11px] text-zinc-500 hover:text-brand-red font-bold flex items-center gap-0.5"
          >
            All Checks <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {latestChecks.length > 0 ? (
          <div className="space-y-3">
            {latestChecks.map((fc) => (
              <Link
                key={fc.id}
                href={`/fact-checks/${fc.slug}`}
                className="block group p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-black/40 dark:hover:bg-black/70 border border-zinc-200 dark:border-zinc-800/80 transition-all"
              >
                <div className="mb-1.5">
                  <FactCheckBadge verdict={fc.verdict} size="sm" />
                </div>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-200 group-hover:text-brand-red dark:group-hover:text-white line-clamp-2">
                  {fc.title}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-black/30 border border-zinc-200 dark:border-zinc-800 text-center space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
            <span className="text-zinc-900 dark:text-zinc-300 font-bold block">Archive Ready</span>
            <p className="text-[11px] text-zinc-500">
              New forensic audits published by the editorial desk will automatically appear here.
            </p>
          </div>
        )}
      </div>

      {/* Featured Civic Poll Widget */}
      {activePoll && (
        <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-brand-border rounded-2xl p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
                Featured Civic Poll
              </span>
            </div>
            <Link
              href="/polls"
              className="text-[11px] text-zinc-500 hover:text-blue-500 font-bold flex items-center gap-0.5"
            >
              All Polls <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <PollWidget
            id={activePoll.id}
            question={activePoll.question}
            description={activePoll.description}
            options={activePoll.options}
            totalVotesCount={activePoll.totalVotesCount}
          />
        </div>
      )}

      {/* Featured Media Literacy Quiz Widget */}
      {activeQuiz && (
        <div className="bg-gradient-to-br from-purple-900/30 to-zinc-900/80 border border-purple-500/30 rounded-2xl p-5 shadow-xs transition-colors space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-white">
                Media Literacy Challenge
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {activeQuiz.questionCount} Questions
            </span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white line-clamp-2">{activeQuiz.title}</h4>
            <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">{activeQuiz.description}</p>
          </div>
          <Link
            href={`/quizzes?quizId=${activeQuiz.id}`}
            className="flex items-center justify-center gap-1.5 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <span>Take Challenge</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Editorial Core Desks */}
      <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-brand-border rounded-2xl p-5 shadow-xs transition-colors">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
          <Flame className="w-4 h-4" />
          <span>Core Editorial Desks</span>
        </div>
        <div className="space-y-1.5">
          {desks.map((desk) => (
            <Link
              key={desk.slug}
              href={`/?category=${desk.slug}`}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors group"
            >
              <span className="text-xs font-bold text-zinc-800 dark:text-white group-hover:text-brand-red transition-colors">
                {desk.name}
              </span>
              <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Explore</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Editorial Mission Statement */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-2 transition-colors">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 block">
          Editorial Principle
        </span>
        <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
          &ldquo;Follow evidence, not political affiliation.&rdquo; HITFACT operates independently without political advertising.
        </p>
      </div>
    </aside>
  );
};
