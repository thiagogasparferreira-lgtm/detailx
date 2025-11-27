import { createContext, useContext, useState } from 'react';

type AuthContextValue = {
  token: string | null;
  login: (t: string) => void;
  logout: () => void;
};

const Ctx = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const login = (t: string) => setToken(t);
  const logout = () => setToken(null);
  return <Ctx.Provider value={{ token, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() { return useContext(Ctx)!; }