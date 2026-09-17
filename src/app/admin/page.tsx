import React from "react";
import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  Users,
  FileText,
  Eye,
  MessageSquare,
  CheckSquare,
  AlertTriangle,
  PlusCircle,
  ArrowUpRight,
} from "lucide-react";
import { FactCheckBadge } from "@/components/feed/FactCheckBadge";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [usersCount, postsCount, commentsCount, pollVotesCount, reportsCount, recentPosts] =
    await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.comment.count(),
      prisma.pollVote.count(),
      prisma.report.count({ where: { status: "PENDING" } }),
      prisma.post.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          author: { include: { profile: true } },
          category: true,
          factCheck: true,
        },
      }),
    ]);

  const totalViews = recentPosts.reduce((acc, p) => acc + (p.views || 0), 0);

  const stats = [
    { label: "Total Users", value: usersCount, icon: <Users className="w-4 h-4 text-blue-400" /> },
    { label: "Published Stories", value: postsCount, icon: <FileText className="w-4 h-4 text-emerald-400" /> },
    { label: "Total Views", value: totalViews.toLocaleString(), icon: <Eye className="w-4 h-4 text-purple-400" /> },
    { label: "Comments", value: commentsCount, icon: <MessageSquare className="w-4 h-4 text-yellow-400" /> },
    { label: "Poll Votes", value: pollVotesCount, icon: <CheckSquare className="w-4 h-4 text-cyan-400" /> },
    { label: "Pending Reports", value: reportsCount, icon: <AlertTriangle className="w-4 h-4 text-amber-400" /> },
  ];

  return (
    <div className="space-y-8">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white font-headline">
            EDITORIAL DASHBOARD & KPI OVERVIEW
          </h1>
          <p className="text-xs text-zinc-400">
            Real-time verification metrics, audience participation, and editorial workflow pipeline.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-red hover:bg-brand-redDark text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-md self-start"
        >
          <PlusCircle className="w-4 h-4" /> Create Post / Check
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl space-y-1 shadow-xs transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">
                {s.label}
              </span>
              {s.icon}
            </div>
            <div className="text-xl font-extrabold font-mono text-zinc-900 dark:text-white">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Editorial Workflow Tracker */}
      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl space-y-3 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-300">
          Editorial Governance & Verification Workflow
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
          {[
            { step: "1. DRAFT", desc: "Initial ingestion" },
            { step: "2. RESEARCH", desc: "Open-source data" },
            { step: "3. REVIEW", desc: "Cross-checks" },
            { step: "4. FACT CHECK", desc: "Forensic audit" },
            { step: "5. APPROVED", desc: "Editor clearance" },
            { step: "6. PUBLISHED", desc: "Live to feed" },
          ].map((w, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-lg border text-[11px] ${
                idx === 5
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-300 font-bold"
                  : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-400"
              }`}
            >
              <div className="font-bold">{w.step}</div>
              <div className="text-[9px] text-zinc-500 mt-0.5">{w.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Publications Table */}
      <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs dark:shadow-lg space-y-3 p-5">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
            Recent Publications & Investigations
          </h2>
          <Link
            href="/admin/posts"
            className="text-xs text-brand-red hover:text-brand-redLight font-semibold flex items-center gap-1"
          >
            Manage All <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentPosts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="py-2.5 px-3">Title & Type</th>
                  <th className="py-2.5 px-3">Verdict / Desk</th>
                  <th className="py-2.5 px-3">Author</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Views</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
                {recentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-zinc-900 dark:text-white line-clamp-1">{post.title}</span>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{post.type}</span>
                    </td>
                    <td className="py-3 px-3">
                      {post.factCheck ? (
                        <FactCheckBadge verdict={post.factCheck.verdict} size="sm" />
                      ) : (
                        <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300">
                          {post.category?.name || "General"}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-zinc-700 dark:text-zinc-300">
                      {post.author.profile?.displayName || post.author.name}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 uppercase">
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-zinc-600 dark:text-zinc-400">{post.views.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={
                          post.type === "FACT_CHECK"
                            ? `/fact-checks/${post.slug}`
                            : `/articles/${post.slug}`
                        }
                        target="_blank"
                        className="text-xs text-brand-red hover:text-brand-redLight font-semibold"
                      >
                        View Live
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-500 space-y-2">
            <FileText className="w-8 h-8 mx-auto text-zinc-400 dark:text-zinc-600" />
            <p className="text-xs text-zinc-800 dark:text-zinc-300 font-bold">No stories or fact-checks published yet.</p>
            <p className="text-[11px] text-zinc-500">
              Click &ldquo;Create Post / Check&rdquo; above to publish your first verified story.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
