import React from "react";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { FactCheckBadge } from "@/components/feed/FactCheckBadge";
import { VerdictType } from "@/types";
import { ShieldCheck, Search, ArrowRight, Calendar, UserCheck, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

interface FactChecksPageProps {
  searchParams?: {
    verdict?: string;
    q?: string;
  };
}

export default async function FactChecksPage({ searchParams }: FactChecksPageProps) {
  const selectedVerdict = searchParams?.verdict?.toUpperCase();
  const searchQuery = searchParams?.q?.toLowerCase();

  const where: any = {
    type: "FACT_CHECK",
    status: "PUBLISHED",
    factCheck: {
      isNot: null,
    },
  };

  if (selectedVerdict && selectedVerdict !== "ALL") {
    where.factCheck = {
      verdict: selectedVerdict,
    };
  }

  const posts = await prisma.post.findMany({
    where,
    include: {
      factCheck: true,
      category: true,
      author: {
        include: { profile: true },
      },
    },
    orderBy: { publishedAt: "desc" },
  });

  const filteredPosts = searchQuery
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery) ||
          p.factCheck?.claim.toLowerCase().includes(searchQuery) ||
          p.factCheck?.claimant.toLowerCase().includes(searchQuery)
      )
    : posts;

  const verdicts: { label: string; value: string }[] = [
    { label: "All Verdicts", value: "ALL" },
    { label: "False", value: "FALSE" },
    { label: "Misleading", value: "MISLEADING" },
    { label: "True", value: "TRUE" },
    { label: "Partly True", value: "PARTLY_TRUE" },
    { label: "Unverified", value: "UNVERIFIED" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 border border-zinc-200 dark:border-brand-border rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-red/10 border border-brand-red/30 text-brand-red text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>HITFACT Verification Archive</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight font-headline">
            EVIDENCE-BASED FACT CHECK DATABASE
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
            Search our comprehensive archive of verified claims, viral media forensics, public statements, and policy assessments. We follow verifiable evidence without bias.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900/70 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
        {/* Verdict filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {verdicts.map((v) => {
            const isActive =
              (!selectedVerdict && v.value === "ALL") || selectedVerdict === v.value;
            return (
              <Link
                key={v.value}
                href={`/fact-checks?${v.value !== "ALL" ? `verdict=${v.value}&` : ""}${
                  searchQuery ? `q=${searchQuery}` : ""
                }`}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                  isActive
                    ? "bg-zinc-900 dark:bg-zinc-800 text-white border-zinc-900 dark:border-zinc-500 shadow-xs"
                    : "bg-zinc-100 dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200"
                }`}
              >
                {v.label}
              </Link>
            );
          })}
        </div>

        {/* Search Input */}
        <form method="GET" action="/fact-checks" className="relative max-w-xs w-full">
          {selectedVerdict && selectedVerdict !== "ALL" && (
            <input type="hidden" name="verdict" value={selectedVerdict} />
          )}
          <input
            type="text"
            name="q"
            defaultValue={searchQuery || ""}
            placeholder="Search claim, claimant..."
            className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl py-2 pl-9 pr-4 text-xs text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-brand-red focus:bg-white dark:focus:bg-zinc-950"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Fact Check Results Grid */}
      <div className="space-y-4">
        <div className="text-xs text-zinc-500 font-semibold">
          Showing {filteredPosts.length} verified assessments
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post) => {
              const fc = post.factCheck!;
              return (
                <div
                  key={post.id}
                  className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-brand-border rounded-2xl p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <FactCheckBadge verdict={fc.verdict} size="sm" />
                      {post.category && (
                        <span className="text-[10px] uppercase font-bold text-zinc-500">
                          {post.category.name}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-zinc-900 dark:text-white hover:text-brand-red transition-colors leading-snug">
                      <Link href={`/fact-checks/${post.slug}`}>{post.title}</Link>
                    </h3>

                    <div className="bg-zinc-50 dark:bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1">
                      <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                        The Claim:
                      </span>
                      <p className="text-xs text-zinc-900 dark:text-zinc-200 font-semibold italic">&ldquo;{fc.claim}&rdquo;</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-600 dark:text-zinc-400 pt-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <UserCheck className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span className="truncate">Claimant: <strong className="text-zinc-900 dark:text-zinc-200">{fc.claimant}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span>{fc.claimDate || "Recent"}</span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {fc.analysis}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-zinc-500">
                      Reviewed by {fc.reviewedBy || "HITFACT Desk"}
                    </span>
                    <Link
                      href={`/fact-checks/${post.slug}`}
                      className="text-brand-red hover:text-brand-redDark font-extrabold flex items-center gap-1 transition-colors"
                    >
                      View Full Evidence <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center space-y-3 shadow-xs">
            <AlertCircle className="w-8 h-8 text-zinc-500 mx-auto" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">No fact checks found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              There are currently no verified fact checks published under this filter. New investigations will appear here once cleared by editorial.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
