import React from "react";
import { prisma } from "@/lib/db";
import { PostCard } from "@/components/feed/PostCard";
import { Sidebar } from "@/components/layout/Sidebar";
import Link from "next/link";
import { Clock, Flame, PlusCircle, ShieldCheck } from "lucide-react";
import { PostWithRelations } from "@/types";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams?: {
    category?: string;
    view?: string;
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const selectedCategory = searchParams?.category;
  const currentView = searchParams?.view || "latest";

  // Fetch categories
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  // Query conditions
  const where: any = {
    status: "PUBLISHED",
  };

  if (selectedCategory) {
    where.category = {
      slug: selectedCategory,
    };
  }

  // Fetch posts with complete relations
  const postsRaw = await prisma.post.findMany({
    where,
    include: {
      author: {
        include: {
          profile: true,
        },
      },
      category: true,
      factCheck: true,
      article: true,
      poll: {
        include: {
          options: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
          saves: true,
        },
      },
    },
    orderBy: currentView === "trending" ? { views: "desc" } : { publishedAt: "desc" },
  });

  const posts = postsRaw as unknown as PostWithRelations[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar border-b border-zinc-200 dark:border-zinc-800">
        <Link
          href="/"
          className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
            !selectedCategory
              ? "bg-brand-red text-white"
              : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-brand-red hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
          }`}
        >
          All Feeds
        </Link>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.slug;
          return (
            <Link
              key={cat.id}
              href={`/?category=${cat.slug}`}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
                isActive
                  ? "bg-brand-red text-white"
                  : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-brand-red hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      {/* Main Grid: Feed + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left / Center: Main Feed */}
        <div className="lg:col-span-8 space-y-6">
          {/* Feed Filter / View Switcher */}
          <div className="flex items-center justify-between bg-white dark:bg-zinc-900/60 p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <div className="flex items-center gap-2">
              <Link
                href={`/?${selectedCategory ? `category=${selectedCategory}&` : ""}view=latest`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentView === "latest"
                    ? "bg-zinc-900 dark:bg-zinc-800 text-white shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Latest
              </Link>
              <Link
                href={`/?${selectedCategory ? `category=${selectedCategory}&` : ""}view=trending`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentView === "trending"
                    ? "bg-zinc-900 dark:bg-zinc-800 text-white shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Trending
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-500 font-semibold pr-2">
              <span>{posts.length} Stories</span>
            </div>
          </div>

          {/* Posts Stream */}
          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center space-y-4 shadow-xs">
              <ShieldCheck className="w-12 h-12 text-brand-red mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  {selectedCategory ? `No Stories in ${selectedCategory}` : "No Stories Published Yet"}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                  {selectedCategory
                    ? `There are currently no verified reports published under the "${selectedCategory}" desk.`
                    : "Verified fact-checks, investigative reports, and media analyses will appear here as soon as they are published."}
                </p>
              </div>
              {selectedCategory && (
                <div className="flex items-center justify-center pt-2">
                  <Link
                    href="/"
                    className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    View All Stories
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-24">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
