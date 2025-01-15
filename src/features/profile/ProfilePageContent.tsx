"use client";
import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import StaticProfilePage from "@/features/profile/StaticProfilePage";
import UserProfile from "@/features/profile/UserProfile";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useMemo, useState } from "react";

export default function ProfilePageContent() {
  const session = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const globalStore = useGlobalStore();
  const { events, userInfo } = useGlobalStore((state) => state);
  const upcomingFilteredEvents = useMemo(() => {
    return events.filter((event) => event.isGoing || event.isFavourite);
  }, [events]);
  return (
    <>
      {session.isAuthenticated ? (
        <UserProfile
          profile={userInfo}
          upcomingEvents={upcomingFilteredEvents}
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
