"use client";
import Loader from "@/components/ui/Loader";
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
  const [isPending, setIsPending] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const { userInfo, upcomingEvents, pastEvents, hostedEvents, setProfileData } =
    useProfileStore();
  useEffect(() => {
    setIsMounted(true);
    if (token) {
      getProfileData(token);
    } else {
      setIsPending(false);
    }
  }, [token]);
  const getProfileData = async (token: string) => {
    try {
      setIsPending(true);
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
      setIsPending(false);
      console.log("Fin de la récupération des données de profil");
    }
  };
  if (isPending) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
        <Loader />
      </div>
    );
  } else {
    return (
      <>
        {isMounted && session.isAuthenticated ? (
          <UserProfile
            profile={userInfo}
            upcomingEvents={upcomingEvents}
            pastEvents={pastEvents}
            hostingEvents={hostedEvents}
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
}
