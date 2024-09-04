// src/app/profile/[id]/page.tsx

import UserProfile from "@/features/profile/UserProfile";

export default async function UserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  // Fetch the user's profile without needing the auth check
  const profileResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/getProfileUser/${id}`,
    {
      method: "GET",
    },
  );

  if (!profileResponse.ok) {
    return <div>Error fetching user profile data</div>;
  }

  const profileData = await profileResponse.json();
  return (
    <UserProfile
      profile={profileData.body}
      upcomingEvents={profileData.body.upcomingEvents || []}
      pastEvents={profileData.body.pastEvents || []}
    />
  );
}
