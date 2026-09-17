import React from "react";
import { prisma } from "@/lib/db";
import { PostCard } from "@/components/feed/PostCard";
import { Bookmark, AlertCircle } from "lucide-react";
import { PostWithRelations } from "@/types";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  // Fetch bookmarked posts (using seeded reader user bookmarks)
  const savedEntries = await prisma.save.findMany({
    include: {
      post: {
        include: {
          author: { include: { profile: true } },
          category: true,
          factCheck: true,
          article: true,
          _count: {
            select: { likes: true, comments: true, saves: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const posts = savedEntries.map((s) => s.post) as unknown as PostWithRelations[];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          <Bookmark className="w-4 h-4" />
          <span>Private Reading List</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-headline">
          SAVED INVESTIGATIONS & FACT CHECKS
        </h1>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          Your bookmarked stories, reference evidence, and archived publications saved for offline verification.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center space-y-3 shadow-xs">
          <AlertCircle className="w-8 h-8 text-zinc-400 dark:text-zinc-500 mx-auto" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">No saved stories yet</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
            Click the bookmark icon on any post card or article to save it to your private reading list.
          </p>
        </div>
      )}
    </div>
  );
}
