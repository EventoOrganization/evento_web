"use client";
import { useGlobalStore } from "@/store/useGlobalStore";
import React, { useEffect } from "react";
import { useSession } from "./SessionProvider";

const GlobalDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { loadEvents, loadUsers, loadUser, loadInterests, refreshUsers } =
    useGlobalStore();
  const { user, token } = useSession();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasCleared = sessionStorage.getItem("hasClearedStorage");

      if (!hasCleared) {
        console.log("Clearing localStorage...");
        localStorage.clear();
        sessionStorage.setItem("hasClearedStorage", "true");
      }
    }
  }, []);

  useEffect(() => {
    loadInterests();
    loadEvents(user || undefined);

    if (user?._id && token) {
      refreshUsers(user._id, token);
      loadUser(token);
    } else {
      loadUsers("", "");
    }
  }, [
    loadInterests,
    loadEvents,
    loadUsers,
    loadUser,
    refreshUsers,
    user,
    token,
  ]);

  return <>{children}</>;
};

export default GlobalDataProvider;
