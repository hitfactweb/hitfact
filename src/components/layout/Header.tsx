"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  Search,
  ShieldCheck,
  Flame,
  CheckSquare,
  HelpCircle,
  Bookmark,
  Shield,
  User,
  LogOut,
  ChevronDown,
  Layers,
  Menu,
  X,
  LogIn,
  Sun,
  Moon,
} from "lucide-react";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, login, register, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === "login") {
      if (emailInput.trim()) {
        login(emailInput.trim(), passwordInput);
        setShowAuthModal(false);
        setEmailInput("");
        setPasswordInput("");
      }
    } else {
      if (nameInput.trim() && emailInput.trim() && usernameInput.trim()) {
        register(nameInput.trim(), emailInput.trim(), usernameInput.trim());
        setShowAuthModal(false);
        setNameInput("");
        setEmailInput("");
        setUsernameInput("");
      }
    }
  };

  const navLinks = [
    { href: "/", label: "Feed", icon: <Layers className="w-4 h-4" /> },
    { href: "/fact-checks", label: "Fact Checks", icon: <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> },
    { href: "/explore", label: "Explore", icon: <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400" /> },
    { href: "/polls", label: "Polls", icon: <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" /> },
    { href: "/quizzes", label: "Quizzes", icon: <HelpCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      {/* Top Brand Banner */}
      <div className="bg-brand-red text-white text-[11px] font-bold tracking-widest px-4 py-1.5 flex items-center justify-between uppercase shadow-xs">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="bg-black text-white px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider">
            FACTS THAT HIT.
          </span>
          <span className="truncate text-xs font-semibold">
            INDEPENDENT DIGITAL MEDIA & FACT-CHECKING PLATFORM
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[10px] tracking-wider font-bold">
          <span>POLITICS • MEDIA • REALITY</span>
          <span className="opacity-90">EVIDENCE OVER AFFILIATION</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo with exact user logos */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/" className="flex items-center gap-3 group">
            {/* User Logo: logo-box on dark, logo-text on light */}
            <div className="relative flex items-center">
              <img
                src="/logo-box.png"
                alt="HITFACT Logo"
                className="h-10 sm:h-11 w-auto object-contain rounded-sm shadow-xs group-hover:scale-103 transition-transform"
              />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-zinc-900 dark:text-white font-extrabold tracking-tight text-xl font-headline">
                HITFACT<span className="text-brand-red">.</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Politics • Media • Reality
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-zinc-100 dark:bg-zinc-800 text-brand-red font-extrabold shadow-xs"
                    : "text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden sm:flex relative flex-1 max-w-xs">
          <input
            type="text"
            placeholder="Search claims, topics, news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-full py-1.5 pl-9 pr-4 text-xs text-zinc-900 dark:text-white placeholder-zinc-500 focus:border-brand-red focus:bg-white dark:focus:bg-zinc-950 focus:outline-none transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
        </form>

        {/* Theme Switcher + Auth/Admin */}
        <div className="flex items-center gap-2">
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-200 hover:text-brand-red dark:hover:text-white hover:border-brand-red transition-all shadow-xs"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700" />
            )}
          </button>

          {isAdmin && (
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-brand-red hover:bg-brand-redDark text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin CMS
            </Link>
          )}

          {currentUser ? (
            /* User Profile Menu */
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-zinc-300 dark:border-zinc-800"
                aria-label="User menu"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-zinc-400 dark:border-zinc-700"
                />
                <ChevronDown className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400 hidden sm:block" />
              </button>

              {showUserMenu && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl py-2 z-50 animate-fade-in text-zinc-800 dark:text-zinc-200"
                  onClick={() => setShowUserMenu(false)}
                >
                  <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Signed in as</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{currentUser.name}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded bg-zinc-100 dark:bg-zinc-800 text-brand-red uppercase">
                      {currentUser.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href={`/profile/${currentUser.username}`}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <User className="w-3.5 h-3.5" />
                      My Profile
                    </Link>
                    <Link
                      href="/saved"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      Saved Bookmarks
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-brand-red hover:bg-zinc-100 dark:hover:bg-zinc-800 font-bold"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        Admin Panel & Editor
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-zinc-500 hover:text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-800 mt-1 pt-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Sign In Button */
            <button
              onClick={() => {
                setAuthMode("login");
                setShowAuthModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Auth Modal (Sign In / Register) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-zinc-900 dark:text-white">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 dark:hover:text-white p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 mb-5">
              <h3 className="text-lg font-bold">
                {authMode === "login" ? "Sign In to HITFACT" : "Create Account"}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {authMode === "login"
                  ? "Access your account and saved investigations."
                  : "Join independent, evidence-driven media."}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {authMode === "register" && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-600 dark:text-zinc-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-white focus:border-brand-red focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-600 dark:text-zinc-400 mb-1">Username</label>
                    <input
                      type="text"
                      required
                      placeholder="username"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-white focus:border-brand-red focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-600 dark:text-zinc-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-white focus:border-brand-red focus:outline-none"
                />
                {authMode === "login" && (
                  <span className="text-[10px] text-zinc-500 block mt-1">
                    For Admin access, use: <strong className="text-brand-red">admin@hitfact.com</strong>
                  </span>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-600 dark:text-zinc-400 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-white focus:border-brand-red focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-red hover:bg-brand-redDark text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-md mt-2"
              >
                {authMode === "login" ? "Sign In" : "Register"}
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500">
              {authMode === "login" ? (
                <span>
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => setAuthMode("register")}
                    className="text-brand-red hover:underline font-bold"
                  >
                    Register
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{" "}
                  <button
                    onClick={() => setAuthMode("login")}
                    className="text-brand-red hover:underline font-bold"
                  >
                    Sign In
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0A0A0A] px-4 py-3 space-y-2 animate-slide-up">
          <form onSubmit={handleSearch} className="relative mb-3">
            <input
              type="text"
              placeholder="Search claims, topics, news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded py-2 pl-9 pr-4 text-xs text-zinc-900 dark:text-white placeholder-zinc-500"
            />
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          </form>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded text-sm font-bold text-brand-red bg-zinc-100 dark:bg-zinc-900"
            >
              <Shield className="w-4 h-4" />
              Admin Panel
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
