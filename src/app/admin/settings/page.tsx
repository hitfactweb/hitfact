"use client";

import React, { useState } from "react";
import { Settings, Shield, Globe, Save } from "lucide-react";

export default function AdminSettingsPage() {
  const [appName, setAppName] = useState("HITFACT");
  const [tagline, setTagline] = useState("FACTS THAT HIT.");
  const [positioning, setPositioning] = useState("Politics • Media • Reality");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white font-headline">
          PLATFORM & EDITORIAL SETTINGS
        </h1>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          Configure branding, verification protocols, security parameters, and API endpoints.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand identity */}
        <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-xs dark:shadow-lg transition-colors">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <Globe className="w-4 h-4 text-brand-red" /> Brand Configuration
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-zinc-700 dark:text-zinc-400">Media Platform Name</label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-brand-red focus:bg-white dark:focus:bg-zinc-950"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-zinc-700 dark:text-zinc-400">Primary Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-brand-red focus:bg-white dark:focus:bg-zinc-950"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase text-zinc-700 dark:text-zinc-400">Editorial Positioning</label>
            <input
              type="text"
              value={positioning}
              onChange={(e) => setPositioning(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-brand-red focus:bg-white dark:focus:bg-zinc-950"
            />
          </div>
        </div>

        {/* Security Parameters */}
        <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-xs dark:shadow-lg transition-colors">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Security & Access Controls
          </h2>

          <div className="space-y-3 text-xs text-zinc-800 dark:text-zinc-300">
            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <div>
                <strong className="text-zinc-900 dark:text-white block">Strict Duplicate Poll Protection</strong>
                <span className="text-[11px] text-zinc-500">
                  Enforces server-side user/hash token uniqueness for voting.
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 font-bold text-[10px]">
                ENABLED
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <div>
                <strong className="text-zinc-900 dark:text-white block">Automated Spam & Link Filtering</strong>
                <span className="text-[11px] text-zinc-500">
                  Holds suspicious external URLs for moderator review.
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 font-bold text-[10px]">
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-brand-red hover:bg-brand-redDark text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-lg"
        >
          <Save className="w-4 h-4" />
          <span>{saved ? "Saved Successfully!" : "Save Platform Settings"}</span>
        </button>
      </form>
    </div>
  );
}
