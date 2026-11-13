import { useState, type ReactNode } from "react";
import { AuthContext } from "./auth.context";
import type { AuthUser } from "../interface/auth.types";

const AUTH_STORAGE_KEY = "salon_pos_user";
const TOKEN_STORAGE_KEY = "salon_pos_token";

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

  const [token, setToken] = useState<string | null>(() => {
    return (
      localStorage.getItem(TOKEN_STORAGE_KEY) ||
      sessionStorage.getItem(TOKEN_STORAGE_KEY) ||
      null
    );
  });

  const login = (userData: AuthUser, authToken?: string, rememberMe = true) => {
    setUser(userData);
    const serialized = JSON.stringify(userData);

    if (authToken) {
      setToken(authToken);
    }

    if (rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEY, serialized);
      if (authToken) {
        localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
      }
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, serialized);
      if (authToken) {
        sessionStorage.setItem(TOKEN_STORAGE_KEY, authToken);
      }
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  const hasPermission = (perm: string): boolean => {
    if (!user) return false;
    const roleLower = (user.role || "").toLowerCase();
    // Admin, owner, salon manager, superuser have full permissions
    if (
      roleLower.includes("admin") ||
      roleLower.includes("owner") ||
      roleLower.includes("superuser") ||
      roleLower.includes("salon_manager") ||
      roleLower.includes("salon manager")
    ) {
      return true;
    }
    if (!user.permissions) return false;
    return Boolean(user.permissions[perm]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

