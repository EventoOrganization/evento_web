"use client";
import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import StaticProfilePage from "@/features/profile/StaticProfilePage";
import UserProfile from "@/features/profile/UserProfile";
import { useGlobalStore } from "@/store/useGlobalStore";
import { UserType } from "@/types/UserType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useEffect, useMemo, useState } from "react";

export default function ProfilePageContent() {
  const session = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const globalStore = useGlobalStore();
  const { events } = useGlobalStore((state) => state);
  const [userInfo, setUserInfo] = useState<UserType | null>(null);
  const upcomingFilteredEvents = useMemo(() => {
    return events.filter((event) => event.isGoing || event.isFavourite);
  }, [events]);
  const loadUser = async (token: string) => {
    try {
      const userRes = await fetchData(
        `/profile/getLoggedUserProfile`,
        HttpMethod.GET,
        null,
        token,
      );
      if (userRes && !userRes.error && userRes.data) {
        setUserInfo(userRes.data as UserType);
      } else {
        console.error("Erreur lors du fetch de l'utilisateur:", userRes?.error);
      }
    } catch (error) {
      console.error("Erreur lors du fetch de l'utilisateur:", error);
    }
  };

  useEffect(() => {
    if (session.isAuthenticated && session.token) {
      loadUser(session.token);
    }
  }, [session]);

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
