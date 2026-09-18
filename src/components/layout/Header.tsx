"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  Eye,
  EyeOff,
  Mail,
  Lock,
  AtSign,
  AlertCircle,
  Loader2,
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
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling and enable ESC key to close modal
  useEffect(() => {
    if (showAuthModal) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setShowAuthModal(false);
          setAuthError(null);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [showAuthModal]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);
    try {
      if (authMode === "login") {
        if (!emailInput.trim()) {
          setAuthError("Please enter your email address.");
          return;
        }
        const res = await login(emailInput.trim(), passwordInput);
        if (res.success) {
          setShowAuthModal(false);
          setEmailInput("");
          setPasswordInput("");
          setAuthError(null);
        } else {
          setAuthError(res.error || "Invalid credentials. Please verify your staff email or password.");
        }
      } else {
        if (!nameInput.trim() || !emailInput.trim() || !usernameInput.trim()) {
          setAuthError("Please fill in all required fields.");
          return;
        }
        const success = register(nameInput.trim(), emailInput.trim(), usernameInput.trim());
        if (success) {
          setShowAuthModal(false);
          setNameInput("");
          setEmailInput("");
          setUsernameInput("");
          setAuthError(null);
        } else {
          setAuthError("Registration failed. Please check your details and try again.");
        }
      }
    } finally {
      setIsSubmitting(false);
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
                setAuthError(null);
                setShowAuthModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-red hover:bg-brand-redDark text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}
        </div>
      </div>

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

          {!currentUser && (
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthMode("login");
                  setAuthError(null);
                  setShowAuthModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-brand-red hover:bg-brand-redDark text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Auth Modal (Sign In / Register) - Rendered into body via Portal for 100% Centered Alignment */}
      {mounted &&
        showAuthModal &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-fade-in"
            onClick={() => {
              setShowAuthModal(false);
              setAuthError(null);
            }}
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Card */}
            <div
              className="relative w-full max-w-md mx-auto my-auto bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-zinc-900 dark:text-white transition-all transform animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  setAuthError(null);
                }}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header with Brand Accent */}
              <div className="text-center space-y-2 mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-[10px] font-black uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                  FACTS THAT HIT.
                </div>
                <h2 className="text-2xl font-black font-headline tracking-tight text-zinc-900 dark:text-white">
                  {authMode === "login" ? "Welcome Back" : "Join HITFACT"}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">
                  {authMode === "login"
                    ? "Sign in to access verified investigations, saved stories, and reader discussions."
                    : "Create a free account to engage with independent, evidence-driven journalism."}
                </p>
              </div>

              {/* Mode Toggle (Tabs) */}
              <div className="grid grid-cols-2 p-1 mb-5 bg-zinc-100 dark:bg-zinc-900/90 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setAuthError(null);
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    authMode === "login"
                      ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs font-extrabold"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("register");
                    setAuthError(null);
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    authMode === "register"
                      ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs font-extrabold"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Error Alert Box */}
              {authError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-700 dark:text-red-400 flex items-start gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{authError}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                {authMode === "register" && (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="Your full name"
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-red/40 focus:border-brand-red transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                        Username
                      </label>
                      <div className="relative">
                        <AtSign className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="choose_username"
                          value={usernameInput}
                          onChange={(e) => setUsernameInput(e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-red/40 focus:border-brand-red transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-red/40 focus:border-brand-red transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl py-2.5 pl-9 pr-10 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-red/40 focus:border-brand-red transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-brand-red to-red-600 hover:from-red-600 hover:to-brand-red text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>{authMode === "login" ? "Sign In to Account" : "Create My Account"}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Footer Switch */}
              <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 text-center text-xs text-zinc-500">
                {authMode === "login" ? (
                  <span>
                    Don&apos;t have an account yet?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("register");
                        setAuthError(null);
                      }}
                      className="text-brand-red hover:underline font-bold ml-1 cursor-pointer"
                    >
                      Create one now
                    </button>
                  </span>
                ) : (
                  <span>
                    Already registered?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("login");
                        setAuthError(null);
                      }}
                      className="text-brand-red hover:underline font-bold ml-1 cursor-pointer"
                    >
                      Sign In here
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
};
