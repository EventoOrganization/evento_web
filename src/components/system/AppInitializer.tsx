"use client";

import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useEventStore } from "@/store/useEventsStore";
import { useInterestsStore } from "@/store/useInterestsStore";
import { usePredefinedMediaStore } from "@/store/usePredefinedMediaStore";
import { useProfileStore } from "@/store/useProfileStore";
import { useUsersStore } from "@/store/useUsersStore";
import { useEffect } from "react";

const AppInitializer = () => {
  const { user, token, isTokenChecked } = useSession();
  const { loadEvents } = useEventStore();
  const { loadUser } = useProfileStore();
  const { loadInterests } = useInterestsStore();
  const { loadUsers } = useUsersStore();
  const { loadPredefinedMedia } = usePredefinedMediaStore();

  useEffect(() => {
    if (!isTokenChecked) {
      console.warn("❌ Token not checked yet");
      return;
    }

    const initAppData = async () => {
      const promises = [];

      // 🔐 connected user
      if (user && token) {
        promises.push(loadEvents(user));
        promises.push(loadUser(token));
        promises.push(loadUsers(user._id, token));
      } else {
        // 🙈 not connected user
        promises.push(loadEvents(undefined));
        promises.push(loadUsers("", ""));
      }

      // 📚 interest are allways fetch
      promises.push(loadInterests());

      // 🖼️ predefined media are allways fetch
      promises.push(loadPredefinedMedia());

      try {
        await Promise.all(promises);
        console.log(
          `✅ App initialization complete for an ${user ? "authenticated" : "unauthenticated"} user.`,
        );
      } catch (err) {
        console.error("❌ Error initializing app:", err);
      }
    };

    initAppData();
  }, [isTokenChecked, user?._id, token]);

  return null;
};

export default AppInitializer;
