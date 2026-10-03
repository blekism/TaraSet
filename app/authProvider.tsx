"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, UserContextValue } from "@/lib/types";
import { apiFetch } from "@/backend/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const AuthContext = createContext<UserContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getCurrentUserData() {
      try {
        const res = await apiFetch(`${API_URL}/auth/id`, {
          credentials: "include",
        });

        if (!res.ok) {
          if (res.status === 401) {
            setUser(null);
            return;
          }

          throw new Error("Failed to load current user");
        }

        const currentUser = await res.json();
        setUser(currentUser.User);
      } finally {
        setLoading(false);
      }
    }

    getCurrentUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userId: user?.id ?? null,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useUser must be used inside Providers");
  }

  return context;
}
