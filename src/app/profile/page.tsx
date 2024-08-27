// src/app/profile/page.tsx

import UserProfile from "@/features/profile/UserProfile";
import { cookies } from "next/headers";

export default async function CurrentUserProfilePage() {
  const token = cookies().get("token");
  const authHeader = {
    Authorization: `Bearer ${token?.value}`,
  };

  // Fetch the user's profile
  const profileResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/getProfile`,
    {
      method: "GET",
      headers: authHeader,
    },
  );

  if (!profileResponse.ok) {
    return <div>Error fetching profile data</div>;
  }

  const profileData = await profileResponse.json();

  // Fetch upcoming events
  const upcomingEventsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/upcomingEvents`,
    {
      method: "GET",
      headers: authHeader,
    },
  );

  if (!upcomingEventsResponse.ok) {
    return <div>Error fetching upcoming events</div>;
  }

  const upcomingEvents = await upcomingEventsResponse.json();

  // Fetch past events
  const pastEventsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/pastEvents`,
    {
      method: "GET",
      headers: authHeader,
    },
  );

  if (!pastEventsResponse.ok) {
    return <div>Error fetching past events</div>;
  }

  const pastEvents = await pastEventsResponse.json();

  // console.log("Upcoming Events:", pastEvents.body);
  return (
    <UserProfile
      profile={profileData.body.userInfo}
      upcomingEvents={upcomingEvents.body.upcomingEvents || []}
      pastEvents={pastEvents.body.pastHostedEvents || []}
      hostingEvents={upcomingEvents.body.hostedByYouEvents || []}
      pastHostedEvents={pastEvents.body.pastHostedEvents || []}
    />
  );
}
