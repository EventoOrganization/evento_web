"use client";
import EventoLoader from "@/components/EventoLoader";
import Section from "@/components/layout/Section";
import { useToast } from "@/hooks/use-toast";
import { UserType } from "@/types/UserType";
import { getCookie } from "@/utils/getCookie";
import React, { createContext, useContext, useEffect, useState } from "react";

interface SessionContextProps {
  user: UserType | null;
  token: string | null;
  startSession: (user: UserType, token: string) => void;
  endSession: () => void;
  updateUser: (user: UserType) => void;
  isAuthenticated: boolean;
  isTokenChecked: boolean;
  tokenExpiredMessage: string | null;
}

const SessionContext = createContext<SessionContextProps | undefined>(
  undefined,
);

export const SessionProvider: React.FC<{
  children: React.ReactNode;
  sessionUser?: UserType | null;
  sessionToken?: string | null;
}> = ({ children, sessionUser = null, sessionToken = null }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<UserType | null>(sessionUser || null);
  const [token, setToken] = useState<string | null>(sessionToken || null);
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

      return true;
    } catch (error) {
      if (user) {
        setTokenExpiredMessage(
          "Your session has expired. Please log in again.",
        );
      }
      return false;
    }
  };

  // Vérification du token lors du chargement session
  useEffect(() => {
    const checkAndValidateToken = async () => {
      if (!token) {
        setIsAuthenticated(false);
        setIsTokenChecked(true);
        toast({
          title: "👋 Hello there!",
          description: "✨ We're loading public content for you.",
          variant: "eventoSuccess",
          duration: 3000,
        });
        return;
      }

      const valid = await isTokenValid(token);
      setIsAuthenticated(valid);
      setIsTokenChecked(true);

      if (!valid) {
        endSession();
        toast({
          title: "⚠️ Session expired",
          description:
            "⏳ Your session has ended. We're switching to guest mode. Please log in again to access your data.",
          variant: "eventoPending",
          duration: 3000,
        });
      } else {
        toast({
          title: "🎉 Welcome back!",
          description: "🔐 Your personal data is being loaded.",
          variant: "eventoSuccess",
          duration: 3000,
        });
      }
    };

    checkAndValidateToken();
  }, [token]); // ← bien déclenché seulement si token est défini

  // Récupération de la session depuis les cookies ou le store
  useEffect(() => {
    // Si la session est déjà fournie, ne rien faire
    if (sessionUser || sessionToken) return;

    const cookie = getCookie("sessionData");

    if (cookie) {
      try {
        const parsed = JSON.parse(cookie);
        if (parsed?.user && parsed?.token) {
          setUser(parsed.user);
          setToken(parsed.token);
        }
      } catch (err) {
        console.error("❌ Failed to parse sessionData cookie:", err);
      }
    } else {
      // Aucune session → on nettoie
      setUser(null);
      setToken(null);
    }
  }, []);

  const startSession = (user: UserType, token: string) => {
    setUser(user);
    setToken(token);
    setIsAuthenticated(true);
    setIsTokenChecked(true);
    document.cookie = `sessionData=${encodeURIComponent(JSON.stringify({ user, token }))}; path=/;`;
  };

  const endSession = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setIsTokenChecked(true);
    document.cookie = `sessionData=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  };
  const updateUser = (updatedUser: UserType) => {
    setUser(updatedUser);
  };

  return (
    <SessionContext.Provider
      value={{
        user,
        token,
        updateUser,
        startSession,
        endSession,
        isAuthenticated,
        isTokenChecked,
        tokenExpiredMessage,
      }}
    >
      {!isTokenChecked ? (
        <Section className="h-screen">
          <EventoLoader />
        </Section>
      ) : (
        children
      )}
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
