"use client";

import React from "react";
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
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser } = useAuth();

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
