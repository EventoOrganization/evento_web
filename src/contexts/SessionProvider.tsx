// src/contexts/SessionProvider.tsx
"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { UserType } from "@/types/UserType";
import React, { createContext, useContext, useEffect, useState } from "react";

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

export const SessionProvider: React.FC<{
  children: React.ReactNode;
  initialUser?: UserType | null;
  initialToken?: string | null;
}> = ({ children, initialUser = null, initialToken = null }) => {
  const auth = useAuthStore();
  const [user, setUser] = useState<UserType | null>(
    initialUser || auth.user || null,
  );
  const [token, setToken] = useState<string | null>(
    initialToken || auth?.user?.token || null,
  );
  useEffect(() => {
    if (!initialUser && !initialToken) {
      const sessionData = document.cookie
        .split("; ")
        .find((row) => row.startsWith("sessionData="))
        ?.split("=")[1];

      if (sessionData) {
        const session = JSON.parse(decodeURIComponent(sessionData));
        setUser(session.user);
        setToken(session.token);
        // console.log("user set from cookie");
      } else {
        if (auth.user && auth.user.token) {
          setUser(auth.user);
          setToken(auth.user.token);
          // console.log("user set from store");
        } else {
          setUser(null);
          setToken(null);
          // console.log("no user found");
        }
      }
    }
  }, [initialUser, initialToken, auth.user]);

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
