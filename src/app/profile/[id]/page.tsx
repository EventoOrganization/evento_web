import UserProfile from "@/features/profile/UserProfile";
import { Metadata } from "next";

type Props = {
  params: { id: string };
};

// Fonction pour récupérer les données côté serveur
async function fetchProfileData(userId: string): Promise<any | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profile/userProfile/${userId}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );
    const profileRes = await res.json();
    return profileRes.data || null;
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profileData = await fetchProfileData(params.id);
  if (!profileData) {
    return {
      title: "User not found - Evento",
      description: "This user profile could not be found on Evento.",
    };
  }

  return {
    title: `${profileData?.username.charAt(0).toUpperCase()}${profileData?.username.slice(1)}`,
    description: `View the profile of ${profileData?.username} on Evento.`,
  };
}

// Composant principal pour la page profil utilisateur (Server Component)
export default async function UserProfilePage({ params }: Props) {
  try {
    const profileData = await fetchProfileData(params.id);
    console.log("Profile Data:", profileData.postEventsHosted);
    if (!profileData) {
      return (
        <>
          <title>User not found - Evento</title>
          <meta
            name="description"
            content="This user profile could not be found on Evento."
          />
          <p>User not found.</p>
        </>
      );
    }

    return (
      <UserProfile
        profile={profileData}
        upcomingEvents={profileData.upcomingEvents || []}
        pastEventsGoing={profileData.pastEventsGoing || []}
        pastEventsHosted={profileData.pastHostedEvents || []}
        hostingEvents={profileData.hostedEvents || []}
      />
    );
  } catch (error) {
    console.error("Error rendering UserProfilePage:", error);
    return <p>Failed to load profile data.</p>;
  }
}
