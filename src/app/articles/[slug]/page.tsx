import React from "react";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { PostInteractions } from "@/components/feed/PostInteractions";
import Link from "next/link";
import { Clock, Calendar, User, ChevronLeft, Link2, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      article: true,
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

  if (!post || !post.article) {
    notFound();
  }

  const art = post.article;
  const mediaUrls: string[] = post.mediaUrls ? JSON.parse(post.mediaUrls) : [];
  const sources: { title: string; url: string; publisher: string }[] = art.sourcesJson
    ? JSON.parse(art.sourcesJson)
    : [];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Feed
      </Link>

      {/* Header section */}
      <div className="space-y-4">
        {post.category && (
          <span className="inline-block px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 uppercase font-bold text-xs">
            {post.category.name}
          </span>
        )}

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-white leading-tight font-headline">
          {post.title}
        </h1>

        {/* Summary Dek */}
        <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium border-l-4 border-brand-red pl-4">
          {art.summary}
        </p>

        {/* Author Byline */}
        <div className="flex items-center justify-between py-4 border-y border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-3">
            <img
              src={
                post.author.profile?.avatar ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
              }
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
            />
            <div>
              <span className="text-sm font-bold text-zinc-900 dark:text-white block">
                {post.author.profile?.displayName || post.author.name}
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {post.author.profile?.bio || "HITFACT Senior Contributor"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-right">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-brand-red" />
              {art.readingTime} min read
            </span>
          </div>
        </div>
      </div>

      {/* Featured Banner */}
      {mediaUrls.length > 0 && (
        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <img src={mediaUrls[0]} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Article Body */}
      <div className="prose dark:prose-invert max-w-none text-base text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-line space-y-4">
        {art.body}
      </div>

      {/* Sources */}
      {sources.length > 0 && (
        <section className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-400 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-brand-red" /> Referenced Primary Sources
          </h3>
          <ul className="space-y-2">
            {sources.map((src, i) => (
              <li
                key={i}
                className="flex items-center justify-between p-2.5 bg-zinc-50 dark:bg-zinc-900/60 rounded border border-zinc-200 dark:border-zinc-800 text-xs"
              >
                <div>
                  <strong className="text-zinc-900 dark:text-white block">{src.title}</strong>
                  <span className="text-[11px] text-zinc-500">{src.publisher}</span>
                </div>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-red hover:text-brand-redLight font-semibold flex items-center gap-1"
                >
                  Source <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Interactions */}
      <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
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
