"use client";

import React, { useState } from "react";
import { X, Copy, Check, MessageSquare, Twitter, Send } from "lucide-react";

interface ShareModalProps {
  title: string;
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ title, url, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `FACTS THAT HIT: ${title}`
    )}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, "_blank");
  };

  const shareWhatsApp = () => {
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `Check this fact check from HITFACT: ${title} - ${url}`
    )}`;
    window.open(shareUrl, "_blank");
  };

  const shareTelegram = () => {
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(
      title
    )}`;
    window.open(shareUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-5 shadow-2xl relative text-zinc-900 dark:text-white transition-colors">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Close share dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">Share Fact-Checked Story</h3>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-1">{title}</p>

        {/* Share buttons */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <button
            onClick={shareTwitter}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-transparent text-zinc-900 dark:text-white text-xs font-semibold gap-1.5 transition-colors"
          >
            <Twitter className="w-5 h-5 text-sky-500" />
            <span>X / Twitter</span>
          </button>
          <button
            onClick={shareWhatsApp}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-transparent text-zinc-900 dark:text-white text-xs font-semibold gap-1.5 transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-emerald-500" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={shareTelegram}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-transparent text-zinc-900 dark:text-white text-xs font-semibold gap-1.5 transition-colors"
          >
            <Send className="w-5 h-5 text-blue-500" />
            <span>Telegram</span>
          </button>
        </div>

        {/* Copy Link Input */}
        <div className="flex items-center gap-2 bg-zinc-50 dark:bg-black border border-zinc-300 dark:border-zinc-800 rounded-xl p-1.5 pl-3">
          <input
            type="text"
            readOnly
            value={url}
            className="bg-transparent text-xs text-zinc-800 dark:text-zinc-300 w-full outline-none select-all"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 bg-brand-red hover:bg-brand-redDark text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
