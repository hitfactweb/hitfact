"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, ShieldCheck, ArrowUpRight } from "lucide-react";
import { FactCheckBadge } from "@/components/feed/FactCheckBadge";

interface LatestFactCheck {
  id: string;
  slug: string;
  title: string;
  verdict: string;
  claim: string;
}

export const Sidebar: React.FC = () => {
  const [latestChecks, setLatestChecks] = useState<LatestFactCheck[]>([]);

  useEffect(() => {
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
