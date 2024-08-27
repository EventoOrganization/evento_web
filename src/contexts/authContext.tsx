// src/contexts/authContext.tsx

"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
  user: any;
  setUser: (user: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Récupérer l'état utilisateur depuis les cookies ou une API
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    const session = document.cookie
      .split("; ")
      .find((row) => row.startsWith("connect.sid="))
      ?.split("=")[1];

    if (token && session) {
      setUser({ token, session });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
