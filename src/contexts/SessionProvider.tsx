// src/contexts/AuthContext.tsx
"use client";
import { UserType } from "@/types/UserType";
import React, { createContext, useContext, useState } from "react";

interface SessionContextProps {
  user: UserType | null;
  token: string | null;
  startSession: (user: UserType, token: string) => void;
  endSession: () => void;
  isAuthenticated: boolean;
}

const SessionContext = createContext<SessionContextProps | undefined>(
  undefined,
);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const startSession = (user: UserType, token: string) => {
    setUser(user);
    setToken(token);
    document.cookie = `token=${token}; path=/;`;
  };

  const endSession = () => {
    setUser(null);
    setToken(null);
    document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  };

  const isAuthenticated = !!user && !!token;

  return (
    <SessionContext.Provider
      value={{ user, token, startSession, endSession, isAuthenticated }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
