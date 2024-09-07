"use client";
import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import UserProfile from "@/features/profile/UserProfile";
import { useProfileStore } from "@/store/useProfileStore";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useEffect, useState } from "react";

export default function CurrentUserProfilePage() {
  const { user } = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const token = user?.token;
  const {
    userInfo,
    upcomingEvents,
    pastEvents,
    filteredUpcomingEventsAttened,
    setProfileData,
  } = useProfileStore();
  // Function to fetch profile data
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
        console.log("Failed to fetch profile data");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      console.log("Finished fetching profile data");
    }
  };

  useEffect(() => {
    if (user && token) {
      getProfileData(token);
    }
  }, [token]);

  const onAuthSuccess = () => {
    if (!token) {
      console.error("No token provided");
      return;
    }
    getProfileData(token);
  };
  useEffect(() => {
    if (!user) {
      setIsAuthModalOpen(true);
    }
  });
  return (
    <>
      <UserProfile
        profile={userInfo}
        upcomingEvents={filteredUpcomingEventsAttened}
        pastEvents={pastEvents}
        hostingEvents={upcomingEvents}
      />
      {isAuthModalOpen && (
        <AuthModal
          onAuthSuccess={() => onAuthSuccess()}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </>
  );
}
