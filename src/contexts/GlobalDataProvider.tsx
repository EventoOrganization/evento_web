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
    console.log("User in GlobalDataProvider:", user); // DEBUG USER
    console.log("Token in GlobalDataProvider:", token); // DEBUG TOKEN

    loadInterests();
    loadEvents(user || undefined);

    if (user?._id && token) {
      console.log("Fetching user data for:", user._id);
      refreshUsers(user._id, token);
      loadUser(token);
    } else {
      console.log("No user found, loading default users");
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
