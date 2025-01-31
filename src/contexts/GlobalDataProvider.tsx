"use client";
import { useEventStore } from "@/store/useEventsStore";
import { useInterestsStore } from "@/store/useInterestsStore";
import { useProfileStore } from "@/store/useProfileStore";
import { useUsersStore } from "@/store/useUsersStore";
import React, { useEffect } from "react";
import { useSession } from "./SessionProvider";

const GlobalDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { loadInterests } = useInterestsStore();
  const { loadUsers } = useUsersStore();
  const { loadEvents } = useEventStore();
  const { loadUser } = useProfileStore();
  const { user, token } = useSession();

  useEffect(() => {
    if (user?._id && token) {
      console.log("Fetching initial data for user:", user._id);
      loadEvents(user);
      loadUser(token);
      loadUsers(user._id, token);
      loadInterests();
    } else {
      console.log("No user found, fetching default data");
      loadUsers(user ? user._id : "", token || "");
      loadInterests();
      loadEvents(user ? user : undefined);
    }
  }, [user?._id, token]);

  return <>{children}</>;
};

export default GlobalDataProvider;
