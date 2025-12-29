import { createContext, useContext, useState, ReactNode } from "react";
import { apiRequest } from "../api/client";

type User = { id: number; email: string; username: string; role: string };

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    const data = await apiRequest("/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username, password }),
    });
    localStorage.setItem("token", data.access_token);
    const me = await apiRequest("/users/me");
    setUser(me);
  };

  const register = async (email: string, username: string, password: string) => {
    await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, username, password }),
    });
    await login(username, password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext missing");
  return ctx;
}
