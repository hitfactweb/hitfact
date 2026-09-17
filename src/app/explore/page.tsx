import React from "react";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Flame, Layers, ShieldCheck, Tag, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { posts: true },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  const tags = await prisma.tag.findMany({
    take: 12,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Title */}
      <div className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white font-headline tracking-tight">
          EXPLORE TOPICS & BEATS
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
          Browse specialized desks covering legislative politics, digital misinformation, algorithmic forensics, and economic data.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-red" /> Core Editorial Desks
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/?category=${cat.slug}`}
              className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-brand-border rounded-xl p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color || "#ED1C24" }}
                  />
                  <span className="text-[11px] font-mono text-zinc-500">
                    {cat._count.posts} {cat._count.posts === 1 ? "story" : "stories"}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-brand-red transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-brand-red font-bold">
                <span>View Desk</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending Tags */}
      <div className="space-y-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
          <Tag className="w-3.5 h-3.5" /> Tracked Topic Tags
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/search?q=${tag.slug}`}
              className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
