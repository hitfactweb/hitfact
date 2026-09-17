import React from "react";
import { prisma } from "@/lib/db";
import { PostCard } from "@/components/feed/PostCard";
import { Search as SearchIcon, AlertCircle } from "lucide-react";
import { PostWithRelations } from "@/types";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams?: {
    q?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.q?.trim() || "";

  let posts: PostWithRelations[] = [];

  if (query) {
    const rawPosts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: query } },
          { caption: { contains: query } },
          { factCheck: { claim: { contains: query } } },
          { factCheck: { claimant: { contains: query } } },
          { article: { summary: { contains: query } } },
        ],
      },
      include: {
        author: {
          include: { profile: true },
        },
        category: true,
        factCheck: true,
        article: true,
        _count: {
          select: { likes: true, comments: true, saves: true },
        },
      },
      orderBy: { publishedAt: "desc" },
    });

    posts = rawPosts as unknown as PostWithRelations[];
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header Form */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-headline">
          SEARCH ARCHIVE & STORIES
        </h1>
        <form method="GET" action="/search" className="relative">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search keywords, viral claims, public figures, or topics..."
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl p-4 pl-12 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand-red shadow-xs dark:shadow-lg transition-colors"
          />
          <SearchIcon className="w-5 h-5 text-zinc-400 dark:text-zinc-500 absolute left-4 top-4" />
        </form>
      </div>

      {/* Results */}
      {query ? (
        <div className="space-y-6">
          <div className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold">
            Found {posts.length} results matching &ldquo;{query}&rdquo;
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
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">No matching stories</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
                We couldn&apos;t find any verified reports matching your search query. Try broader keywords or browse categories.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-zinc-500 dark:text-zinc-400 text-xs">
          Enter a term above to search our investigations, news reports, and fact checks.
        </div>
      )}
    </div>
  );
}
