"use client";

import React, { useState, useEffect } from "react";
import { X, Send, Heart, CornerDownRight, Flag, Shield, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface CommentItem {
  id: string;
  userName: string;
  userRole: string;
  userAvatar: string;
  body: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies?: CommentItem[];
}

interface CommentsDrawerProps {
  postId: string;
  postTitle: string;
  isOpen: boolean;
  onClose: () => void;
  initialComments?: CommentItem[];
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  postId,
  postTitle,
  isOpen,
  onClose,
}) => {
  const { currentUser } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && postId) {
      setLoading(true);
      fetch(`/api/v1/posts/${postId}/comments`)
        .then((res) => res.json())
        .then((data) => {
          if (data.comments && Array.isArray(data.comments)) {
            setComments(
              data.comments.map((c: any) => ({
                id: c.id,
                userName: c.user?.profile?.displayName || c.user?.name || "Reader",
                userRole: c.user?.role || "USER",
                userAvatar:
                  c.user?.profile?.avatar ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
                body: c.body,
                createdAt: new Date(c.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                likes: c._count?.likes || 0,
                replies: c.replies?.map((r: any) => ({
                  id: r.id,
                  userName: r.user?.profile?.displayName || r.user?.name || "Reader",
                  userRole: r.user?.role || "USER",
                  userAvatar:
                    r.user?.profile?.avatar ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
                  body: r.body,
                  createdAt: new Date(r.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  likes: 0,
                })),
              }))
            );
          } else {
            setComments([]);
          }
        })
        .catch(() => setComments([]))
        .finally(() => setLoading(false));
    }
  }, [isOpen, postId]);

  if (!isOpen) return null;

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: CommentItem = {
      id: `comm_${Date.now()}`,
      userName: currentUser?.name || "Guest Reader",
      userRole: currentUser?.role || "USER",
      userAvatar:
        currentUser?.avatar ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      body: commentText.trim(),
      createdAt: "Just now",
      likes: 0,
    };

    if (replyingToId) {
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === replyingToId) {
            return {
              ...c,
              replies: [...(c.replies || []), newComment],
            };
          }
          return c;
        })
      );
      setReplyingToId(null);
    } else {
      setComments([newComment, ...comments]);
    }

    try {
      await fetch(`/api/v1/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: commentText.trim(),
          userId: currentUser?.id,
          parentId: replyingToId,
        }),
      });
    } catch {}

    setCommentText("");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 dark:bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 w-full max-w-lg h-full flex flex-col shadow-2xl animate-slide-up text-zinc-900 dark:text-white transition-colors">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Community Discussion</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">{postTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close comments"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comment list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="text-center py-12 text-zinc-500 text-xs">Loading comments...</div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="space-y-2">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800/80 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={comment.userAvatar}
                        alt={comment.userName}
                        className="w-6 h-6 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                      />
                      <div>
                        <span className="text-xs font-bold text-zinc-900 dark:text-white">{comment.userName}</span>
                        {comment.userRole === "FACT_CHECKER" && (
                          <span className="ml-1.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-brand-red text-white uppercase inline-flex items-center gap-0.5">
                            <Shield className="w-2.5 h-2.5" /> Staff
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-500">{comment.createdAt}</span>
                  </div>

                  <p className="text-xs text-zinc-800 dark:text-zinc-300 leading-relaxed pl-8 mb-2">{comment.body}</p>

                  <div className="flex items-center justify-between pl-8 text-xs text-zinc-500">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setReplyingToId(comment.id)}
                        className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                      >
                        <CornerDownRight className="w-3.5 h-3.5" />
                        <span>Reply</span>
                      </button>
                    </div>
                    <button
                      title="Report comment"
                      className="hover:text-amber-500 dark:hover:text-amber-400 p-1"
                      onClick={() => alert("Comment reported for moderation review. Thank you.")}
                    >
                      <Flag className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="pl-6 space-y-2 border-l-2 border-zinc-200 dark:border-zinc-800 ml-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="p-2.5 bg-zinc-100/70 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/60 rounded-xl">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <img
                              src={reply.userAvatar}
                              alt={reply.userName}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-200">{reply.userName}</span>
                          </div>
                          <span className="text-[9px] text-zinc-500">{reply.createdAt}</span>
                        </div>
                        <p className="text-xs text-zinc-700 dark:text-zinc-300 pl-7">{reply.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-16 space-y-2 text-zinc-500">
              <MessageSquare className="w-8 h-8 mx-auto text-zinc-400 dark:text-zinc-600" />
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold">No comments yet</p>
              <p className="text-[11px] text-zinc-500">Be the first to join the verified discussion.</p>
            </div>
          )}
        </div>

        {/* Reply indicator banner */}
        {replyingToId && (
          <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between text-xs text-zinc-800 dark:text-zinc-300">
            <span>Replying to comment...</span>
            <button
              onClick={() => setReplyingToId(null)}
              className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleAddComment} className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={replyingToId ? "Write your reply..." : "Add to the discussion..."}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand-red focus:bg-white dark:focus:bg-zinc-900"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="p-2 bg-brand-red hover:bg-brand-redDark disabled:opacity-50 text-white rounded-lg transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
