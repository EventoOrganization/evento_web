"use client";
import { useGlobalStore } from "@/store/useGlobalStore";
import React, { useEffect } from "react";
import { useSession } from "./SessionProvider";

const GlobalDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { loadEvents, loadUsers, loadUser, loadInterests } = useGlobalStore();
  const { user, token } = useSession();

  // 🏁 Chargement initial des données
  useEffect(() => {
    if (user?._id && token) {
      console.log("Fetching initial data for user:", user._id);
      loadEvents(user);
      loadUser(token);
      loadUsers(user._id, token);
      loadInterests();
    } else {
      console.log("No user found, fetching default data");
      loadUsers("", "");
      loadInterests();
      loadEvents(undefined);
    }
  }, [user?._id, token]); // Exécution uniquement si l'utilisateur ou le token change

  // 🔄 Auto-refresh toutes les 60 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("🔄 Auto-refreshing data...");
      loadEvents(user ? user : undefined);
      loadUsers(user?._id || "", token || "");
    }, 60000); // 60 secondes

    return () => clearInterval(interval); // Nettoyage de l'intervalle
  }, []); // Ne s'exécute qu'une seule fois au montage

  return <>{children}</>;
};

export default GlobalDataProvider;
