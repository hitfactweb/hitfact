import React from "react";
import Link from "next/link";
import { ShieldCheck, Scale, FileText } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-[#050505] border-t border-zinc-200 dark:border-brand-border text-zinc-600 dark:text-zinc-400 py-12 px-4 sm:px-6 lg:px-8 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <img
              src="/logo-box.png"
              alt="HITFACT Logo"
              className="h-9 w-auto object-contain rounded-xs"
            />
            <span className="text-zinc-900 dark:text-white font-extrabold text-xl font-headline tracking-tight">
              HITFACT<span className="text-brand-red">.</span>
            </span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Independent digital media platform dedicated to investigative journalism, evidence-based fact-checking, and public accountability.
          </p>
          <div className="flex items-center gap-2 text-xs text-zinc-800 dark:text-zinc-300 font-bold">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Independent • Open Source • Non-Partisan
          </div>
        </div>

        {/* Verification Standards */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-red" />
            Verification Standards
          </h4>
          <ul className="text-xs space-y-2 font-medium">
            <li>
              <Link href="/fact-checks" className="hover:text-brand-red transition-colors">
                Fact Check Database Archive
              </Link>
            </li>
            <li>
              <span className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer">
                Primary Sourcing Methodology
              </span>
            </li>
            <li>
              <span className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer">
                Correction & Retraction Policy
              </span>
            </li>
            <li>
              <span className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer">
                Non-Partisan Editorial Charter
              </span>
            </li>
          </ul>
        </div>

        {/* Civic Tools */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Civic Participation
          </h4>
          <ul className="text-xs space-y-2 font-medium">
            <li>
              <Link href="/polls" className="hover:text-brand-red transition-colors">
                Public Opinion Polls
              </Link>
            </li>
            <li>
              <Link href="/quizzes" className="hover:text-brand-red transition-colors">
                Media Literacy Quizzes
              </Link>
            </li>
            <li>
              <Link href="/forms/public-trust-media-2026" className="hover:text-brand-red transition-colors">
                Public Research Survey
              </Link>
            </li>
            <li>
              <Link href="/admin" className="text-brand-red hover:text-brand-redDark font-bold transition-colors">
                Editorial Staff Portal
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Principles */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
            Platform Integrity
          </h4>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            HITFACT does not label claims as FALSE merely because evidence is missing; inconclusive claims receive UNVERIFIED. We do not accept political advertising.
          </p>
          <div className="pt-2 text-[11px] text-zinc-500">
            © {new Date().getFullYear()} HITFACT Media. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
