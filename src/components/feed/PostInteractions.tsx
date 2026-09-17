"use client";

import React, { useState } from "react";
import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import { CommentsDrawer } from "./CommentsDrawer";
import { ShareModal } from "./ShareModal";

interface PostInteractionsProps {
  postId: string;
  postTitle: string;
  postSlug: string;
  initialLikes?: number;
  initialComments?: number;
  isLikedInitially?: boolean;
  isSavedInitially?: boolean;
}

export const PostInteractions: React.FC<PostInteractionsProps> = ({
  postId,
  postTitle,
  postSlug,
  initialLikes = 0,
  initialComments = 0,
  isLikedInitially = false,
  isSavedInitially = false,
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(isLikedInitially);
  const [isSaved, setIsSaved] = useState(isSavedInitially);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? Math.max(0, prev - 1) : prev + 1));
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/post/${postSlug}`
    : `https://hitfact.com/post/${postSlug}`;

  return (
    <>
      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3 text-zinc-400">
        {/* Left: Like & Comment */}
        <div className="flex items-center gap-6">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-1.5 text-xs font-semibold hover:text-white transition-all ${
              isLiked ? "text-brand-red font-bold" : ""
            }`}
            aria-label="Like post"
          >
            <Heart
              className={`w-4 h-4 transition-transform active:scale-125 ${
                isLiked ? "fill-brand-red text-brand-red" : ""
              }`}
            />
            <span>{likes}</span>
          </button>

          <button
            onClick={() => setShowComments(true)}
            className="flex items-center gap-1.5 text-xs font-semibold hover:text-white transition-colors"
            aria-label="View comments"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{initialComments}</span>
          </button>
        </div>

        {/* Right: Save & Share */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSave}
            className={`p-1.5 rounded-lg hover:bg-zinc-800 transition-colors ${
              isSaved ? "text-amber-400" : "hover:text-white"
            }`}
            aria-label="Save bookmark"
            title={isSaved ? "Saved" : "Save bookmark"}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-amber-400 text-amber-400" : ""}`} />
          </button>

          <button
            onClick={() => setShowShare(true)}
            className="p-1.5 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors"
            aria-label="Share post"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Drawers and Modals */}
      <CommentsDrawer
        postId={postId}
        postTitle={postTitle}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />

      <ShareModal
        title={postTitle}
        url={shareUrl}
        isOpen={showShare}
        onClose={() => setShowShare(false)}
      />
    </>
  );
};
