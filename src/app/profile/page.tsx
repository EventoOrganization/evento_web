"use client";
// src/app/profile/page.tsx
import UserProfile from "@/features/profile/UserProfile";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CurrentUserProfilePage() {
  const user = useAuthStore((state) => state.user);
  const {
    userInfo,
    upcomingEvents,
    pastEvents,
    filteredUpcomingEventsAttended: hostingEvents,
    setProfileData,
  } = useProfileStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    const fetchProfile = async () => {
      try {
        // Fetch the user's profile
        const profileDataResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/getProfile`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
          },
        );

        if (!profileDataResponse.ok) {
          throw new Error("Failed to fetch profile data.");
        }

        const profileDataJson = await profileDataResponse.json();
        console.log("profile fetch data", profileDataJson.body);

        // Fetch upcoming events
        const upcomingEventsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/upcomingEvents`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
          },
        );

        if (!upcomingEventsResponse.ok) {
          throw new Error("Failed to fetch upcoming events.");
        }

        const upcomingEventsJson = await upcomingEventsResponse.json();

        // Fetch past events
        const pastEventsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/pastEvents`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
          },
        );

        if (!pastEventsResponse.ok) {
          throw new Error("Failed to fetch past events.");
        }

        const pastEventsJson = await pastEventsResponse.json();

        // Set the profile data and events in the store
        setProfileData({
          userInfo: profileDataJson.body,
          upcomingEvents: upcomingEventsJson.body.upcomingEvents || [],
          pastEvents: pastEventsJson.body.pastHostedEvents || [],
          filteredUpcomingEventsAttended:
            upcomingEventsJson.body.hostedByYouEvents || [],
        });
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, setProfileData]);

  if (!user) {
    return (
      <div>
        You need to log in to view this page.{" "}
        <Link href="/signin">Sign in</Link>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userInfo) {
    return <div>Profile data is loading...</div>;
  }

  return (
    <UserProfile
      profile={userInfo}
      upcomingEvents={upcomingEvents}
      pastEvents={pastEvents}
      hostingEvents={hostingEvents}
    />
  );
}
