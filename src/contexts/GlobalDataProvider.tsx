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
    if (user?._id && token) {
      console.log("Fetching for user:", user._id);
      refreshUsers(user._id, token);
      loadEvents(user);
      loadUser(token);
    } else {
      console.log("No user found, loading default users");
      loadUsers("", "");
      loadInterests();
      loadEvents(undefined);
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
