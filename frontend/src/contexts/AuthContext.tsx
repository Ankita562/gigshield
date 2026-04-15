import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthUser = {
  id?: string;
  _id?: string;
  name?: string;
  phone?: string;
  email?: string;
  hasActivePlan?: boolean;
  planType?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: AuthUser, tokenData: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<AuthUser>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("gigshield_user");
      const savedToken = localStorage.getItem("token");

      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
    } catch (err) {
      console.error("Failed to restore auth state:", err);
      localStorage.removeItem("gigshield_user");
      localStorage.removeItem("gigshield_policy");
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: AuthUser, tokenData: string) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("gigshield_user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("gigshield_user");
    localStorage.removeItem("gigshield_policy");
    localStorage.removeItem("token");
  };

  const updateUser = (userData: Partial<AuthUser>) => {
    setUser((prev) => {
      const updated = { ...(prev || {}), ...userData };
      localStorage.setItem("gigshield_user", JSON.stringify(updated));
      return updated;
    });
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!user && !!token,
      isLoading,
      login,
      logout,
      updateUser,
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}