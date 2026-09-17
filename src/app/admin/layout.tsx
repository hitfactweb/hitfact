"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  CheckSquare,
  HelpCircle,
  FormInput,
  MessageSquare,
  Image as ImageIcon,
  Settings,
  ArrowLeft,
  Shield,
  PlusCircle,
  Lock,
  LogIn,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, isAdmin, login } = useAuth();

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(false);
    const success = login(emailInput.trim(), passwordInput);
    if (!success) {
      setLoginError(true);
    }
  };

  // If not logged in as admin, show secure access gate
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#070707] text-zinc-900 dark:text-white flex flex-col justify-center items-center px-4 py-12">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center mx-auto mb-3 border border-brand-red/20">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-extrabold text-zinc-900 dark:text-white font-headline">
              Editorial Staff Authentication
            </h1>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              This portal is restricted to authorized HITFACT editorial staff. Unauthorized access is prohibited.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 rounded-lg text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Invalid editorial credentials. Please verify your staff email.</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Staff Email or Username
              </label>
              <input
                type="text"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@hitfact.com"
                className="w-full text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-brand-red hover:bg-brand-redDark text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Editorial CMS</span>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Public News Feed
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: "/admin/posts", label: "Posts & Stories", icon: <FileText className="w-4 h-4" /> },
    { href: "/admin/posts/new", label: "New Post / Check", icon: <PlusCircle className="w-4 h-4 text-brand-red" /> },
    { href: "/admin/polls", label: "Poll Manager", icon: <CheckSquare className="w-4 h-4" /> },
    { href: "/admin/quizzes", label: "Quiz Manager", icon: <HelpCircle className="w-4 h-4" /> },
    { href: "/admin/forms", label: "Form Responses", icon: <FormInput className="w-4 h-4" /> },
    { href: "/admin/moderation", label: "Moderation Queue", icon: <MessageSquare className="w-4 h-4" /> },
    { href: "/admin/media", label: "Media Library", icon: <ImageIcon className="w-4 h-4" /> },
    { href: "/admin/settings", label: "Platform Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#070707] text-zinc-900 dark:text-white flex flex-col transition-colors">
      {/* Admin Top Header */}
      <div className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Public Site
          </Link>
          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
          <div className="flex items-center gap-2">
            <span className="bg-brand-red text-white font-black text-xs px-1.5 py-0.5 rounded font-headline">
              HITFACT
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Editorial CMS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <img
              src={
                currentUser?.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              }
              alt="Admin"
              className="w-7 h-7 rounded-full object-cover border border-zinc-300 dark:border-zinc-700"
            />
            <div className="hidden sm:block text-right">
              <span className="block font-bold text-zinc-900 dark:text-white leading-none">{currentUser?.name || "Admin"}</span>
              <span className="text-[10px] text-brand-red uppercase font-semibold">
                {currentUser?.role || "SUPER_ADMIN"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-8">
        {/* Admin Sidebar */}
        <aside className="w-56 shrink-0 hidden md:block space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3 py-2">
            CMS Navigation
          </div>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && item.href !== "/admin/posts/new" && pathname.startsWith(item.href + "/"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-brand-red/10 dark:bg-brand-red/15 text-brand-red dark:text-brand-redLight border border-brand-red/30 shadow-xs font-bold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
