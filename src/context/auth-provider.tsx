import { useState, type ReactNode } from "react";
import { AuthContext } from "./auth.context";
import type { AuthUser } from "../interface/auth.types";

const AUTH_STORAGE_KEY = "salon_pos_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored =
        localStorage.getItem(AUTH_STORAGE_KEY) ||
        sessionStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? (JSON.parse(stored) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  const login = (userData: AuthUser, rememberMe = true) => {
    setUser(userData);
    const serialized = JSON.stringify(userData);
    if (rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEY, serialized);
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, serialized);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

