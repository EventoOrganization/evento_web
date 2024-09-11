"use client";
import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import UserProfile from "@/features/profile/UserProfile";
import { useProfileStore } from "@/store/useProfileStore";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useEffect, useState } from "react";

export default function CurrentUserProfilePage() {
  const session = useSession();
  const { user, token } = session;
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userTriedToCloseModal, setUserTriedToCloseModal] = useState(false);
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
  }, []);
  const getProfileData = async (token: string, forceUpdate = false) => {
    if (userInfo && !forceUpdate) return;
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

  useEffect(() => {
    console.log(
      "Vérification du statut de l'utilisateur avec le token :",
      token,
    );
    if (user && token) {
      getProfileData(token, true);
    } else {
      setIsAuthModalOpen(true);
    }
  }, [token, user]);

  useEffect(() => {
    if (!session.isAuthenticated && userTriedToCloseModal) {
      console.log("Rouvrir la modal car l'utilisateur n'est pas authentifié.");
      setIsAuthModalOpen(true);
    }
  }, [userTriedToCloseModal, session.isAuthenticated]);

  useEffect(() => {
    if (!session.isAuthenticated && !isAuthModalOpen) {
      console.log(
        "L'utilisateur n'est pas authentifié et la modal est fermée, réouverture de la modal.",
      );
      setIsAuthModalOpen(true);
    }
  }, [session.isAuthenticated, isAuthModalOpen]);

  const onAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setUserTriedToCloseModal(false);
    if (token) getProfileData(token, true);
  };

  const handleModalClose = () => {
    setIsAuthModalOpen(false);
    setUserTriedToCloseModal(true);
  };

  return (
    <>
      {isMounted && session.isAuthenticated && (
        <UserProfile
          profile={userInfo}
          upcomingEvents={filteredUpcomingEventsAttened}
          pastEvents={pastEvents}
          hostingEvents={upcomingEvents}
        />
      )}
      {isAuthModalOpen && (
        <AuthModal onAuthSuccess={onAuthSuccess} onClose={handleModalClose} />
      )}
    </>
  );
}
