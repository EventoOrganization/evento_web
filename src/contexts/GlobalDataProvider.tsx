"use client";
import { useGlobalStore } from "@/store/useGlobalStore"; // Import du store global
import React, { useEffect } from "react";
import { useSession } from "./SessionProvider";

const GlobalDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    loadEvents,
    loadUsers,
    loadUser,
    loadInterests,
    refreshEvents,
    refreshInterests,
    refreshUsers,
  } = useGlobalStore(); // Accès aux loaders et refreshers du store
  const { user, token } = useSession();
  // Fonction pour gérer le rafraîchissement des données
  const refreshData = () => {
    refreshInterests();
    refreshEvents(user || undefined);
    refreshUsers(user?._id || "", token || "");
  };

  useEffect(() => {
    loadInterests();
    loadEvents(user || undefined);
    if (user?._id && token) {
      refreshUsers(user._id, token);
      refreshEvents(user);
      loadUser(token);
    } else {
      loadUsers("", "");
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshData();
      }
    };

    const interval = setInterval(() => {
      refreshData();
    }, 3000000);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [
    loadInterests,
    loadEvents,
    loadUsers,
    loadUser,
    refreshInterests,
    refreshEvents,
    refreshUsers,
    token,
  ]);

  return <>{children}</>;
};

export default GlobalDataProvider;
