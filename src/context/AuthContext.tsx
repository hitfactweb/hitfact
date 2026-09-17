"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "EDITOR" | "FACT_CHECKER" | "SUPER_ADMIN";
  username: string;
  avatar: string;
}

interface AuthContextType {
  currentUser: CurrentUser | null;
  login: (email: string, pass?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, username: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => ({ success: false }),
  register: () => false,
  logout: () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("hitfact_auth_user");
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch {
        setCurrentUser(null);
      }
    }
  }, []);

  const login = async (
    email: string,
    pass?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass?.trim() || "";

    if (cleanEmail === "admin@hitfact.com" || cleanEmail === "admin") {
      try {
        const res = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail, password: cleanPass }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          return {
            success: false,
            error: data.error || "Authentication failed. Invalid staff credentials.",
          };
        }

        const adminUser: CurrentUser = data.user || {
          id: "usr_admin",
          name: "Chief Editor (Admin)",
          email: "admin@hitfact.com",
          role: "SUPER_ADMIN",
          username: "admin",
          avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        };
        setCurrentUser(adminUser);
        localStorage.setItem("hitfact_auth_user", JSON.stringify(adminUser));
        return { success: true };
      } catch {
        return {
          success: false,
          error: "Connection error: Unable to contact secure authentication server.",
        };
      }
    }

    // Standard user login
    const user: CurrentUser = {
      id: `usr_${Date.now()}`,
      name: cleanEmail.split("@")[0],
      email: cleanEmail,
      role: "USER",
      username: cleanEmail.split("@")[0],
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    };
    setCurrentUser(user);
    localStorage.setItem("hitfact_auth_user", JSON.stringify(user));
    return { success: true };
  };

  const register = (name: string, email: string, username: string): boolean => {
    const newUser: CurrentUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: "USER",
      username: username.trim().toLowerCase(),
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    };
    setCurrentUser(newUser);
    localStorage.setItem("hitfact_auth_user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("hitfact_auth_user");
  };

  const isAdmin = currentUser?.role === "SUPER_ADMIN" || currentUser?.role === "EDITOR";

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
