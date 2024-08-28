// src/app/profile/page.tsx

import UserProfile from "@/features/profile/UserProfile";
import { getSessionSSR } from "@/utils/authUtilsSSR";
import { fetchDataFromApi } from "@/utils/fetchData";
import { Link } from "lucide-react";
export default async function CurrentUserProfilePage() {
  const session = getSessionSSR();

  if (!session.isLoggedIn) {
    return (
      <div>
        You need to log in to view this page.{" "}
        <Link href="/signin">Sign in</Link>
      </div>
    );
  }
  try {
    // Fetch the user's profile
    const profileData = await fetchDataFromApi(
      `${process.env.NEXT_PUBLIC_API_URL}/users/getProfile`,
      "GET",
    );

    // Fetch upcoming events
    const upcomingEvents = await fetchDataFromApi(
      `${process.env.NEXT_PUBLIC_API_URL}/users/upcomingEvents`,
      "GET",
    );

    // Fetch past events
    const pastEvents = await fetchDataFromApi(
      `${process.env.NEXT_PUBLIC_API_URL}/users/pastEvents`,
      "GET",
    );

    return (
      <UserProfile
        profile={profileData.body}
        upcomingEvents={upcomingEvents.body.upcomingEvents || []}
        pastEvents={pastEvents.body.pastHostedEvents || []}
        hostingEvents={upcomingEvents.body.hostedByYouEvents || []}
        pastHostedEvents={pastEvents.body.pastHostedEvents || []}
      />
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Error fetching profile or events data</div>;
  }
}
