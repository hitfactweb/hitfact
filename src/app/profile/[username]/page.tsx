import React from "react";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/feed/PostCard";
import { User, Shield, Calendar, Layers, MessageSquare, Bookmark } from "lucide-react";
import { PostWithRelations } from "@/types";

export const dynamic = "force-dynamic";

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  let profile = await prisma.profile.findUnique({
    where: { username: params.username },
    include: {
      user: {
        include: {
          posts: {
            where: { status: "PUBLISHED" },
            include: {
              author: { include: { profile: true } },
              category: true,
              factCheck: true,
              article: true,
              _count: {
                select: { likes: true, comments: true, saves: true },
              },
            },
            orderBy: { createdAt: "desc" },
          },
          _count: {
            select: { posts: true, comments: true, likes: true, saves: true },
          },
        },
      },
    },
  });

  // Fallback to first user if params is 'me'
  if (!profile) {
    const defaultUser = await prisma.user.findFirst({
      include: {
        profile: true,
        posts: {
          include: {
            author: { include: { profile: true } },
            category: true,
            factCheck: true,
            article: true,
            _count: {
              select: { likes: true, comments: true, saves: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: { posts: true, comments: true, likes: true, saves: true },
        },
      },
    });

    if (defaultUser?.profile) {
      profile = {
        ...defaultUser.profile,
        user: defaultUser,
      };
    } else {
      notFound();
    }
  }

  const user = profile.user;
  const posts = user.posts as unknown as PostWithRelations[];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Card */}
      <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-brand-border rounded-2xl p-6 sm:p-8 shadow-xs dark:shadow-xl space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={
              profile.avatar ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
            }
            alt={profile.displayName}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-brand-red shadow-sm"
          />
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">{profile.displayName}</h1>
              {user.role === "FACT_CHECKER" && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-red text-white uppercase inline-flex items-center gap-0.5">
                  <Shield className="w-3 h-3" /> Fact Checker
                </span>
              )}
              {user.role === "SUPER_ADMIN" && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-brand-red uppercase border border-brand-red">
                  Super Admin
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">@{profile.username}</p>
            {profile.bio && <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed mt-2">{profile.bio}</p>}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-center">
          <div>
            <span className="block text-lg sm:text-xl font-bold text-zinc-900 dark:text-white font-mono">
              {user._count.posts}
            </span>
            <span className="text-[11px] text-zinc-500 font-medium">Stories</span>
          </div>
          <div>
            <span className="block text-lg sm:text-xl font-bold text-zinc-900 dark:text-white font-mono">
              {user._count.comments}
            </span>
            <span className="text-[11px] text-zinc-500 font-medium">Comments</span>
          </div>
          <div>
            <span className="block text-lg sm:text-xl font-bold text-zinc-900 dark:text-white font-mono">
              {user._count.likes}
            </span>
            <span className="text-[11px] text-zinc-500 font-medium">Liked</span>
          </div>
          <div>
            <span className="block text-lg sm:text-xl font-bold text-zinc-900 dark:text-white font-mono">
              {user._count.saves}
            </span>
            <span className="text-[11px] text-zinc-500 font-medium">Saved</span>
          </div>
        </div>
      </div>

      {/* Authored Stories */}
      {posts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-red" /> Published Stories & Checks
          </h2>
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
