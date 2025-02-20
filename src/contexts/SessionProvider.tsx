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
  tokenExpiredMessage: string | null;
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!user && !!token,
  );
  const [tokenExpiredMessage, setTokenExpiredMessage] = useState<string | null>(
    null,
  );
  const [isTokenChecked, setIsTokenChecked] = useState<boolean>(false);

  // Vérifie si le token est valide
  const isTokenValid = async (token: string | null): Promise<boolean> => {
    if (!token) return false;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/validate-token`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Token is invalid or expired");

      console.log("✅ Token is valid");
      return true;
    } catch (error) {
      if (user) {
        setTokenExpiredMessage(
          "Your session has expired. Please log in again.",
        );
      }
      console.log("❌ Token is invalid or expired");
      return false;
    }
  };

  // Vérification du token lors du chargement initial
  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false);
      setIsTokenChecked(true);
      return;
    }

    (async () => {
      const valid = await isTokenValid(token);
      setIsAuthenticated(valid);
      setIsTokenChecked(true);

      if (!valid) {
        endSession();
      }
    })();
  });

  // Récupération de la session depuis les cookies ou le store
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
      } else if (auth.user && auth.user.token) {
        setUser(auth.user);
        setToken(auth.user.token);
      } else {
        setUser(null);
        setToken(null);
      }
    }
  }, [initialUser, initialToken, auth.user]);

  const startSession = (user: UserType, token: string) => {
    setUser(user);
    setToken(token);
    setIsAuthenticated(true);
    setIsTokenChecked(true);
    document.cookie = `token=${token}; path=/;`;
  };

  const endSession = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setIsTokenChecked(true);
    document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  };

  return (
    <SessionContext.Provider
      value={{
        user,
        token,
        startSession,
        endSession,
        isAuthenticated,
        tokenExpiredMessage,
      }}
    >
      {!isTokenChecked ? <div>Loading...</div> : children}
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
