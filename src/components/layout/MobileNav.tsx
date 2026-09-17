"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, ShieldCheck, Flame, CheckSquare, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { currentUser } = useAuth();

  const items = [
    { href: "/", label: "Feed", icon: <Layers className="w-5 h-5" /> },
    { href: "/fact-checks", label: "Fact Check", icon: <ShieldCheck className="w-5 h-5" /> },
    { href: "/explore", label: "Explore", icon: <Flame className="w-5 h-5" /> },
    { href: "/polls", label: "Polls", icon: <CheckSquare className="w-5 h-5" /> },
    { href: `/profile/${currentUser?.username || "admin"}`, label: "Profile", icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur border-t border-zinc-200 dark:border-brand-border py-2 px-4 flex justify-around items-center transition-colors shadow-lg">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive ? "text-brand-red font-bold" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            {item.icon}
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
