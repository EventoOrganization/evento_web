"use client";
import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import StaticProfilePage from "@/features/profile/StaticProfilePage";
import UserProfile from "@/features/profile/UserProfile";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useEffect, useMemo, useState } from "react";

export default function ProfilePageContent() {
  const session = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const globalStore = useGlobalStore();
  const { userInfo, events } = useGlobalStore((state) => state);
  useEffect(() => {
    if (!isMounted) setIsMounted(true);
  }, [isMounted]);

  const upcomingFilteredEvents = useMemo(() => {
    return events.filter((event) => event.isGoing || event.isFavourite);
  }, [events]);

  return (
    <>
      {isMounted && session.isAuthenticated ? (
        <UserProfile
          profile={userInfo}
          upcomingEvents={upcomingFilteredEvents}
          pastEventsGoing={userInfo?.pastEventsGoing || []}
          pastEventsHosted={userInfo?.pastEventsHosted || []}
          hostingEvents={userInfo?.hostedEvents}
        />
      ) : (
        <StaticProfilePage
          setIsAuthModalOpen={() => setIsAuthModalOpen(true)}
        />
      )}
      {isAuthModalOpen && (
        <AuthModal
          onAuthSuccess={(token?: string) => {
            if (token) globalStore.loadUser(token);
          }}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </>
  );
}
