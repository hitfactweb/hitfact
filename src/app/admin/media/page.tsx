"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Upload, Check, Copy } from "lucide-react";

interface MediaAsset {
  id: string;
  name: string;
  url: string;
  size: string;
  dimensions: string;
  date: string;
}

export default function AdminMediaPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUploadClick = () => {
    const url = prompt("Enter image URL to register in media library:");
    if (url && url.trim()) {
      const newAsset: MediaAsset = {
        id: `media_${Date.now()}`,
        name: `asset-${Date.now().toString().slice(-4)}.jpg`,
        url: url.trim(),
        size: "Web Resource",
        dimensions: "1920x1080",
        date: "Just now",
      };
      setMediaAssets([newAsset, ...mediaAssets]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white font-headline">
            MEDIA ASSET REPOSITORY
          </h1>
          <p className="text-xs text-zinc-400">
            Secure asset repository, high-resolution imagery, and forensic file verification.
          </p>
        </div>
        <button
          onClick={handleUploadClick}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-red hover:bg-brand-redDark text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-md self-start"
        >
          <Upload className="w-4 h-4" /> Add Media Asset
        </button>
      </div>

      {mediaAssets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mediaAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs dark:shadow-lg group transition-colors"
            >
              <div className="aspect-video w-full bg-zinc-100 dark:bg-black relative overflow-hidden">
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3.5 space-y-2">
                <p className="text-xs font-bold text-zinc-900 dark:text-white truncate" title={asset.name}>
                  {asset.name}
                </p>
                <button
                  onClick={() => handleCopy(asset.id, asset.url)}
                  className="w-full py-1.5 rounded bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-700 dark:text-zinc-300 font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied URL</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center space-y-3 shadow-xs">
          <ImageIcon className="w-10 h-10 text-zinc-400 dark:text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">No Media Uploaded</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
            Uploaded images from investigations and fact checks will be stored here for quick URL reuse.
          </p>
        </div>
      )}
    </div>
  );
}
