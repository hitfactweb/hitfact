import React from "react";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { FactCheckBadge } from "@/components/feed/FactCheckBadge";
import { PostInteractions } from "@/components/feed/PostInteractions";
import Link from "next/link";
import {
  ShieldCheck,
  Calendar,
  UserCheck,
  Link2,
  AlertTriangle,
  History,
  FileCheck2,
  ExternalLink,
  ChevronLeft,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface FactCheckPageProps {
  params: {
    slug: string;
  };
}

export default async function FactCheckPage({ params }: FactCheckPageProps) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      factCheck: true,
      category: true,
      author: {
        include: { profile: true },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
          saves: true,
        },
      },
    },
  });

  if (!post || !post.factCheck) {
    notFound();
  }

  const fc = post.factCheck;
  const sources: { title: string; url: string; publisher: string }[] = fc.sourcesJson
    ? JSON.parse(fc.sourcesJson)
    : [];
  const mediaUrls: string[] = post.mediaUrls ? JSON.parse(post.mediaUrls) : [];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <Link
        href="/fact-checks"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Fact Check Database
      </Link>

      {/* Header section */}
      <div className="space-y-4">
        {/* Category & Date */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
          {post.category && (
            <span className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 uppercase font-bold text-[10px] border border-zinc-200 dark:border-zinc-700">
              {post.category.name}
            </span>
          )}
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Published: {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
          </span>
          {fc.reviewedBy && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Reviewed by: {fc.reviewedBy}
              </span>
            </>
          )}
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white leading-tight font-headline">
          {post.title}
        </h1>

        {/* Prominent Verdict Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs dark:shadow-2xl space-y-4 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-zinc-500 dark:text-zinc-400 block mb-1">
                Official HITFACT Verdict
              </span>
              <FactCheckBadge verdict={fc.verdict} size="lg" />
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 dark:text-zinc-400 block">
                Claim Source
              </span>
              <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">{fc.claimSource || "Public discourse"}</span>
            </div>
          </div>

          {/* The Claim & Claimant */}
          <div className="space-y-2">
            <span className="text-[11px] uppercase font-bold tracking-wider text-zinc-500 dark:text-zinc-400 block">
              Claim under investigation
            </span>
            <blockquote className="text-base sm:text-lg font-medium text-zinc-900 dark:text-white italic pl-4 border-l-4 border-brand-red">
              &ldquo;{fc.claim}&rdquo;
            </blockquote>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Claimant: <strong className="text-zinc-900 dark:text-white font-bold">{fc.claimant}</strong>{" "}
              {fc.claimDate && <span>({fc.claimDate})</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Featured Media */}
      {mediaUrls.length > 0 && (
        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <img src={mediaUrls[0]} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Context & Background */}
      {fc.context && (
        <section className="space-y-3 bg-amber-50/70 dark:bg-zinc-900/60 p-6 rounded-xl border border-amber-200/80 dark:border-zinc-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Context & Background
          </h2>
          <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">{fc.context}</p>
        </section>
      )}

      {/* Step-by-Step Evidence */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
          <FileCheck2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Key Evidence & Forensic Findings
        </h2>
        <div className="prose dark:prose-invert max-w-none text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-line bg-white dark:bg-zinc-950/70 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
          {fc.evidence}
        </div>
      </section>

      {/* Technical Analysis */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
          <ShieldCheck className="w-5 h-5 text-brand-red" /> Analytical Conclusion
        </h2>
        <div className="bg-white dark:bg-zinc-900/80 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed shadow-xs">
          {fc.analysis}
        </div>
      </section>

      {/* Primary Sources & Documentation */}
      {sources.length > 0 && (
        <section className="space-y-3 bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-400 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-brand-red" /> Primary Sources & Verifiable Records
          </h2>
          <ul className="space-y-2">
            {sources.map((source, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2.5 rounded bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs"
              >
                <div>
                  <strong className="text-zinc-900 dark:text-white block">{source.title}</strong>
                  <span className="text-[11px] text-zinc-500">{source.publisher}</span>
                </div>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-brand-red hover:text-brand-redLight font-semibold text-xs ml-4"
                >
                  Verify <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Correction History */}
      {fc.correctionHistory && (
        <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/40 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800/80">
          <History className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
          <span>{fc.correctionHistory}</span>
        </div>
      )}

      {/* Social Interactions */}
      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <PostInteractions
          postId={post.id}
          postTitle={post.title}
          postSlug={post.slug}
          initialLikes={post._count.likes}
          initialComments={post._count.comments}
        />
      </div>
    </article>
  );
}
