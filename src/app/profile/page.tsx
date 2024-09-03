"use client";
// src/app/profile/page.tsx
import UserProfile from "@/features/profile/UserProfile";
import { useAuthStore } from "@/store/useAuthStore";
import { UserType } from "@/types/UserType";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EventType } from "react-hook-form";

export default function CurrentUserProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [profileData, setProfileData] = useState<UserType | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<EventType[]>([]);
  const [pastEvents, setPastEvents] = useState<EventType[]>([]);
  const [hostedByYouEvents, setHostedByYouEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    const fetchProfile = async () => {
      try {
        // console.log(user.token);
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
        setProfileData(profileDataJson.body);
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
        // console.log(upcomingEventsResponse);
        if (!upcomingEventsResponse.ok) {
          throw new Error("Failed to fetch upcoming events.");
        }

        const upcomingEventsJson = await upcomingEventsResponse.json();

        setUpcomingEvents(upcomingEventsJson.body.upcomingEvents || []);
        setHostedByYouEvents(upcomingEventsJson.body.hostedByYouEvents || []);
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
        setPastEvents(pastEventsJson.body.pastHostedEvents || []);
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
  }, [user]);

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

  if (!profileData) {
    return <div>Profile data is loading...</div>;
  }

  return (
    <UserProfile
      profile={profileData}
      upcomingEvents={upcomingEvents}
      pastEvents={pastEvents}
      hostingEvents={hostedByYouEvents}
    />
  );
}
