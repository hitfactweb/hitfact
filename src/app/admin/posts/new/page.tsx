"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FactCheckBadge } from "@/components/feed/FactCheckBadge";
import { VerdictType } from "@/types";
import {
  FileText,
  ShieldCheck,
  Layers,
  Send,
  ArrowLeft,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function NewPostPage() {
  const router = useRouter();
  const { currentUser } = useAuth();

  const [postType, setPostType] = useState<"STANDARD" | "ARTICLE" | "FACT_CHECK">("FACT_CHECK");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [mediaUrl, setMediaUrl] = useState(
    "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1000&auto=format&fit=crop&q=80"
  );
  const [status, setStatus] = useState("PUBLISHED");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Article state
  const [summary, setSummary] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [readingTime, setReadingTime] = useState(4);

  // Fact Check state
  const [claim, setClaim] = useState("");
  const [claimant, setClaimant] = useState("");
  const [claimDate, setClaimDate] = useState("Recent");
  const [claimSource, setClaimSource] = useState("Social media circulation");
  const [context, setContext] = useState("");
  const [evidence, setEvidence] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [verdict, setVerdict] = useState<VerdictType>("FALSE");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          type: postType,
          caption,
          mediaUrl,
          status,
          authorId: currentUser?.id || "usr_admin",
          summary,
          bodyText,
          readingTime,
          claim,
          claimant,
          claimDate,
          claimSource,
          context,
          evidence,
          analysis,
          verdict,
        }),
      });

      const data = await res.json();
      if (data.success && data.post) {
        if (postType === "FACT_CHECK") {
          router.push(`/fact-checks/${data.post.slug}`);
        } else if (postType === "ARTICLE") {
          router.push(`/articles/${data.post.slug}`);
        } else {
          router.push("/");
        }
      } else {
        alert(data.error || "Failed to create post");
      }
    } catch (err: any) {
      alert("Error creating post: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Posts
        </Link>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500">Author:</span>
          <span className="font-bold text-zinc-900 dark:text-white">{currentUser?.name || "Chief Editor"}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Post Type Selector */}
        <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl space-y-2 shadow-xs">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            Select Publication Format
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { type: "FACT_CHECK", label: "Fact Check & Verdict", icon: <ShieldCheck className="w-4 h-4 text-emerald-500" /> },
              { type: "ARTICLE", label: "Investigative Article", icon: <FileText className="w-4 h-4 text-blue-500" /> },
              { type: "STANDARD", label: "Standard Feed Post", icon: <Layers className="w-4 h-4 text-amber-500" /> },
            ].map((fmt) => (
              <button
                type="button"
                key={fmt.type}
                onClick={() => setPostType(fmt.type as any)}
                className={`p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  postType === fmt.type
                    ? "bg-brand-red/10 dark:bg-brand-red/20 border-brand-red text-brand-red dark:text-white font-extrabold"
                    : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                {fmt.icon}
                <span>{fmt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Universal Core Fields */}
        <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl space-y-4 shadow-xs dark:shadow-lg">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-300">
              Headline / Title <span className="text-brand-red">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Enter bold, factual headline..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand-red focus:bg-white dark:focus:bg-zinc-950"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-300">
              Media Banner Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand-red focus:bg-white dark:focus:bg-zinc-950 font-mono"
              />
            </div>
            {mediaUrl && (
              <div className="aspect-video max-w-sm rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 mt-2">
                <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-300">
              Short Dek / Lead Caption
            </label>
            <textarea
              rows={2}
              placeholder="Brief summary appearing in feeds and cards..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-3 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand-red focus:bg-white dark:focus:bg-zinc-950 resize-none"
            />
          </div>
        </div>

        {/* Fact-Check Specialized Fields */}
        {postType === "FACT_CHECK" && (
          <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-brand-border p-6 rounded-xl space-y-5 shadow-xs dark:shadow-lg">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-red flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Fact-Check Evidence & Verdict Breakdown
              </span>
              <FactCheckBadge verdict={verdict} size="sm" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-300">
                  Select Official Verdict <span className="text-brand-red">*</span>
                </label>
                <select
                  value={verdict}
                  onChange={(e) => setVerdict(e.target.value as VerdictType)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-brand-red focus:bg-white dark:focus:bg-zinc-950"
                >
                  <option value="FALSE">FALSE (Refuted by evidence)</option>
                  <option value="MISLEADING">MISLEADING (True parts but omits key context)</option>
                  <option value="TRUE">TRUE (Supported by primary evidence)</option>
                  <option value="PARTLY_TRUE">PARTLY TRUE (Accurate in isolation, flawed premise)</option>
                  <option value="UNVERIFIED">UNVERIFIED (Insufficient reliable evidence)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-300">
                  Claimant (Who said it?) <span className="text-brand-red">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Official Spokesperson, Viral X clip, Minister"
                  value={claimant}
                  onChange={(e) => setClaimant(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand-red focus:bg-white dark:focus:bg-zinc-950"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-300">
                The Exact Claim Under Investigation <span className="text-brand-red">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="Enter exact verbatim claim being verified..."
                value={claim}
                onChange={(e) => setClaim(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-3 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand-red focus:bg-white dark:focus:bg-zinc-950"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-300">
                Context & Circulating Background
              </label>
              <textarea
                rows={2}
                placeholder="Where, when, and how did this claim circulate? What is the background?"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-3 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand-red focus:bg-white dark:focus:bg-zinc-950"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-300">
                Forensic Evidence (Numbered Points) <span className="text-brand-red">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="1. Primary document findings&#10;2. Hardware/network hash verification&#10;3. Cross-referenced official records"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-3 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand-red focus:bg-white dark:focus:bg-zinc-950 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-300">
                Editorial Analysis & Conclusion <span className="text-brand-red">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Comprehensive synthesis explaining why the claim earns this specific verdict..."
                value={analysis}
                onChange={(e) => setAnalysis(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-3 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand-red focus:bg-white dark:focus:bg-zinc-950"
              />
            </div>
          </div>
        )}

        {/* Article Specialized Fields */}
        {postType === "ARTICLE" && (
          <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl space-y-4 shadow-xs dark:shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block border-b border-zinc-200 dark:border-zinc-800 pb-2">
              Investigative Article Long-form Content
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-300">
                  Estimated Reading Time (Minutes)
                </label>
                <input
                  type="number"
                  value={readingTime}
                  onChange={(e) => setReadingTime(Number(e.target.value))}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-brand-red focus:bg-white dark:focus:bg-zinc-950"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-300">
                  Summary / Dek
                </label>
                <input
                  type="text"
                  placeholder="In-depth investigative summary..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand-red focus:bg-white dark:focus:bg-zinc-950"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-300">
                Full Investigation Body (Markdown supported)
              </label>
              <textarea
                rows={10}
                placeholder="Write full investigative report..."
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-3 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand-red focus:bg-white dark:focus:bg-zinc-950 font-sans"
              />
            </div>
          </div>
        )}

        {/* Workflow Status & Submit */}
        <div className="flex items-center justify-between bg-white dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-brand-red font-bold"
            >
              <option value="PUBLISHED">PUBLISHED (Go Live Immediately)</option>
              <option value="APPROVED">APPROVED (Cleared by Editor)</option>
              <option value="REVIEW">UNDER REVIEW (Pending Cross-check)</option>
              <option value="DRAFT">DRAFT (Work in progress)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-brand-red hover:bg-brand-redDark disabled:opacity-50 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-lg"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? "Publishing..." : "Publish to HITFACT"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
