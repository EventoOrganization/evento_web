// src/app/profile/[id]/page.tsx
"use client";
import UserProfile from "@/features/profile/UserProfile";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useEffect, useState } from "react";

export default function UserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id: userId } = params;
  const [profileData, setProfileData] = useState<any>(null);
  const getProfileData = async () => {
    if (profileData) return;
    try {
      console.log("userId", userId);
      const profileRes = await fetchData<any>(
        `/profile/userProfile/${userId}`,
        HttpMethod.GET,
        null,
        null,
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
    if (!profileData) getProfileData();
  });

  if (!profileData) {
    return <div>Loading...</div>;
  } else {
    return (
      <UserProfile
        profile={profileData.userInfo}
        upcomingEvents={profileData?.userInfo.upcomingEvents || []}
        pastEvents={profileData?.userInfo.pastEvents || []}
      />
    );
  }
}
