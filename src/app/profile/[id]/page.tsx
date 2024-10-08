// src/app/profile/[id]/page.tsx
"use client";
import UserProfile from "@/features/profile/UserProfile";
import { useGlobalStore } from "@/store/useGlobalStore";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useEffect, useState } from "react";

export default function UserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id: userId } = params;
  const [profileData, setProfileData] = useState<any>(null);
  const { events } = useGlobalStore((state) => state);
  const getProfileData = async () => {
    if (profileData) return;
    try {
      const profileRes = await fetchData<any>(
        `/profile/userProfile/${userId}`,
        HttpMethod.GET,
        null,
        null,
      );
      if (profileRes && profileRes.data) {
        setProfileData(profileRes.data);
        console.log("Fetched profile data:", profileRes.data);
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
      <>
        <UserProfile
          profile={profileData}
          upcomingEvents={
            events.filter((event) => event.isGoing || event.isFavourite) || []
          }
          pastEvents={profileData?.pastEvents || []}
          hostingEvents={profileData?.hostedEvents || []}
        />
      </>
    );
  }
}
