"use client";
import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import StaticProfilePage from "@/features/profile/StaticProfilePage";
import UserProfile from "@/features/profile/UserProfile";
import { useProfileStore } from "@/store/useProfileStore";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useEffect, useState } from "react";

export default function CurrentUserProfilePage() {
  const session = useSession();
  const { token } = session;
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const {
    userInfo,
    upcomingEvents,
    pastEvents,
    filteredUpcomingEventsAttened,
    setProfileData,
  } = useProfileStore();
  useEffect(() => {
    setIsMounted(true);
    if (token) getProfileData(token);
  }, [token]);
  const getProfileData = async (token: string) => {
    try {
      const profileRes = await fetchData<any>(
        `/profile/getLoggedUserProfile`,
        HttpMethod.GET,
        null,
        token,
      );
      if (profileRes && profileRes.data) {
        setProfileData(profileRes.data);
      } else {
        console.log("Échec de la récupération des données de profil");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données de profil :",
        error,
      );
    } finally {
      console.log("Fin de la récupération des données de profil");
    }
  };

  return (
    <>
      {isMounted && session.isAuthenticated ? (
        <UserProfile
          profile={userInfo}
          upcomingEvents={filteredUpcomingEventsAttened}
          pastEvents={pastEvents}
          hostingEvents={upcomingEvents}
        />
      ) : (
        <StaticProfilePage
          setIsAuthModalOpen={() => setIsAuthModalOpen(true)}
        />
      )}
      {isAuthModalOpen && (
        <AuthModal
          onAuthSuccess={(token: string) => getProfileData(token)}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </>
  );
}
