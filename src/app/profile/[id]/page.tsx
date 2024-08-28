// src/app/profile/page.tsx

import UserProfile from "@/features/profile/UserProfile";
import { getSessionSSR } from "@/utils/authUtilsSSR";
import { cookies } from "next/headers";

export default async function UserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const session = getSessionSSR();
  const user = session.user;
  const id = params.id;
  const token = cookies().get("token");
  const authHeader = {
    Authorization: `Bearer ${token?.value}`,
  };

  // Fetch the user's profile
  const profileResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/getProfileUser/${id}`,
    {
      method: "GET",
      headers: authHeader,
    },
  );
  if (!profileResponse.ok) {
    return <div>Error fetching user profile data</div>;
  }

  const profileData = await profileResponse.json();
  console.log("profileData", profileData.body);
  return (
    <UserProfile
      id={id}
      profile={profileData.body}
      upcomingEvents={profileData.body.upcomingEvents || []}
      pastEvents={profileData.body.pastEvents || []}
      // hostingEvents={upcomingEvents.body.hostedByYouEvents || []}
      // pastHostedEvents={pastEvents.body.pastHostedEvents || []}
    />
  );
}
