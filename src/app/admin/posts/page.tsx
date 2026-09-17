import React from "react";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { PlusCircle, ExternalLink, ShieldCheck, Eye, Clock } from "lucide-react";
import { FactCheckBadge } from "@/components/feed/FactCheckBadge";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    include: {
      author: { include: { profile: true } },
      category: true,
      factCheck: true,
      _count: {
        select: { likes: true, comments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white font-headline">
            CONTENT & INVESTIGATIONS MANAGER
          </h1>
          <p className="text-xs text-zinc-400">
            Publish, edit, and audit news publications, investigative pieces, and fact-check cards.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-red hover:bg-brand-redDark text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-md self-start"
        >
          <PlusCircle className="w-4 h-4" /> New Post / Fact Check
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs dark:shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Desk / Verdict</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
              {posts.map((post) => {
                const liveUrl =
                  post.type === "FACT_CHECK"
                    ? `/fact-checks/${post.slug}`
                    : `/articles/${post.slug}`;

                return (
                  <tr key={post.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="font-bold text-zinc-900 dark:text-white block line-clamp-1">{post.title}</span>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400">slug: {post.slug}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-bold uppercase">
                        {post.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {post.factCheck ? (
                        <FactCheckBadge verdict={post.factCheck.verdict} size="sm" />
                      ) : (
                        <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                          {post.category?.name || "General"}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 text-[10px] font-bold uppercase">
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-700 dark:text-zinc-300">
                      {post.author.profile?.displayName || post.author.name}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={liveUrl}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs text-brand-red hover:text-brand-redLight font-semibold"
                      >
                        Live <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
