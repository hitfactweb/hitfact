"use client";

import React from "react";
import Link from "next/link";
import { PostWithRelations } from "@/types";
import { FactCheckBadge } from "./FactCheckBadge";
import { PostInteractions } from "./PostInteractions";
import { Shield, Clock, ArrowRight } from "lucide-react";

interface PostCardProps {
  post: PostWithRelations;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const isFactCheck = post.type === "FACT_CHECK" && post.factCheck;
  const isArticle = post.type === "ARTICLE" && post.article;
  let mediaUrls: string[] = [];
  if (post.mediaUrls) {
    try {
      const parsed = JSON.parse(post.mediaUrls);
      mediaUrls = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      mediaUrls = [post.mediaUrls];
    }
  }

  const postLink = isFactCheck
    ? `/fact-checks/${post.slug}`
    : isArticle
    ? `/articles/${post.slug}`
    : `/posts/${post.slug}`;

  return (
    <article className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-brand-border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
      {/* Top Meta Bar */}
      <div className="p-4 sm:p-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={
              post.author?.profile?.avatar ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
            }
            alt={post.author?.name || "Author"}
            className="w-8 h-8 rounded-full object-cover border border-zinc-300 dark:border-zinc-700"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-zinc-900 dark:text-white hover:text-brand-red transition-colors">
                {post.author?.profile?.displayName || post.author?.name}
              </span>
              {post.author?.role === "FACT_CHECKER" && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-brand-red/10 text-brand-red uppercase inline-flex items-center gap-0.5 border border-brand-red/30">
                  <Shield className="w-2.5 h-2.5" /> Staff
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-medium">
              <span>@{post.author?.profile?.username || "hitfact"}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Category Pill */}
        {post.category && (
          <Link
            href={`/explore?category=${post.category.slug}`}
            className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:text-white hover:bg-brand-red transition-colors border border-zinc-200 dark:border-transparent"
          >
            {post.category.name}
          </Link>
        )}
      </div>

      {/* Media Banner */}
      {mediaUrls.length > 0 && (
        <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-black">
          <Link href={postLink} className="block w-full h-full group">
            <img
              src={mediaUrls[0]}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            />
            {isFactCheck && post.factCheck && (
              <div className="absolute top-3 left-3 shadow-md">
                <FactCheckBadge verdict={post.factCheck.verdict} size="md" />
              </div>
            )}
          </Link>
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-4 sm:p-5 space-y-3.5">
        {/* Title */}
        <h2 className="text-base sm:text-xl font-bold text-zinc-900 dark:text-white leading-snug hover:text-brand-red transition-colors">
          <Link href={postLink}>{post.title}</Link>
        </h2>

        {/* Fact-Check Callout Box */}
        {isFactCheck && post.factCheck && (
          <div className="p-4 bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 block mb-0.5">
                  Examined Claim
                </span>
                <p className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-200 font-bold italic">
                  &ldquo;{post.factCheck.claim}&rdquo;
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-400 pt-1.5 border-t border-zinc-200 dark:border-zinc-800/60">
              <span>Claimant: <strong className="text-zinc-900 dark:text-zinc-200">{post.factCheck.claimant}</strong></span>
              <Link
                href={postLink}
                className="text-brand-red hover:text-brand-redDark font-extrabold inline-flex items-center gap-1 text-[11px]"
              >
                Read Evidence <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}

        {/* Standard Caption */}
        {post.caption && !isFactCheck && (
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-3">
            {post.caption}
          </p>
        )}

        {/* Read More for Articles */}
        {isArticle && post.article && (
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-zinc-500 text-[11px] font-medium">
              {post.article.readingTime} min read • Investigative Report
            </span>
            <Link
              href={postLink}
              className="text-xs font-bold text-brand-red hover:text-brand-redDark inline-flex items-center gap-1"
            >
              Read Full Investigation <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Post Interactions */}
        <PostInteractions
          postId={post.id}
          postTitle={post.title}
          postSlug={post.slug}
          initialLikes={post._count?.likes ?? 0}
          initialComments={post._count?.comments ?? 0}
          isLikedInitially={post.isLiked}
          isSavedInitially={post.isSaved}
        />
      </div>
    </article>
  );
};
