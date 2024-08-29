// src/app/profile/page.tsx
import UserProfile from "@/features/profile/UserProfile";
import { UserType } from "@/types/UserType";
import { getSessionSSR } from "@/utils/authUtilsSSR";
import { fetchData } from "@/utils/fetchData";
import Link from "next/link";
import { EventType } from "react-hook-form";

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
    const profileData = (await fetchData(`/users/getProfile`)) as UserType;
    // Fetch upcoming events
    const upcomingEvents = (await fetchData(`/users/upcomingEvents`)) as {
      upcomingEvents: EventType[];
      hostedByYouEvents: EventType[];
    };
    // Fetch past events
    const pastEvents = (await fetchData(`/users/pastEvents`)) as {
      pastHostedEvents: EventType[];
    };

    return (
      <UserProfile
        profile={profileData}
        upcomingEvents={upcomingEvents?.upcomingEvents || []}
        pastEvents={pastEvents?.pastHostedEvents || []}
        hostingEvents={upcomingEvents?.hostedByYouEvents || []}
        pastHostedEvents={pastEvents?.pastHostedEvents || []}
      />
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Error fetching profile or events data</div>;
  }
}
