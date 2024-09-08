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
  const {
    userInfo,
    upcomingEvents,
    pastEvents,
    filteredUpcomingEventsAttened,
    setProfileData,
  } = useProfileStore();
  // Function to fetch profile data
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
        console.log("Failed to fetch profile data");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      console.log("Finished fetching profile data");
    }
  };

  useEffect(() => {
    console.log("Checking user status with Token:", token);
    if (user && token) {
      getProfileData(token, true);
    } else {
      setIsAuthModalOpen(true);
    }
  }, []);

  const onAuthSuccess = () => {
    setIsAuthModalOpen(false);
    if (token) getProfileData(token, true);
  };
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
