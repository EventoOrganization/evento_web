import UserProfile from "@/features/profile/UserProfile";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { Metadata } from "next";

type Props = {
  params: { id: string };
};

// Fonction pour récupérer les données côté serveur
async function fetchProfileData(userId: string): Promise<any | null> {
  try {
    console.log("Fetching profile for user:", userId);
    const profileRes = await fetchData<any>(
      `/profile/userProfile/${userId}`,
      HttpMethod.GET,
      null,
      null,
    );
    console.log("Profile response:", profileRes);
    return profileRes.data || null;
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return null;
  }
}

// Fonction pour générer dynamiquement le metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profileData = await fetchProfileData(params.id);

  if (!profileData) {
    return {
      title: "User not found - Evento",
      description: "This user profile could not be found on Evento.",
    };
  }

  return {
    title: `${profileData?.username.charAt(0).toUpperCase()}${profileData?.username.slice(1)} - Evento`,
    description: `View the profile of ${profileData?.username} on Evento.`,
  };
}

// Composant principal pour la page profil utilisateur (Server Component)
export default async function UserProfilePage({ params }: Props) {
  try {
    const profileData = await fetchProfileData(params.id);
    if (!profileData) {
      return <p>User not found.</p>;
    }

    return (
      <UserProfile
        profile={profileData}
        upcomingEvents={profileData.upcomingEvents || []}
        pastEvents={profileData.pastEvents || []}
        hostingEvents={profileData.hostedEvents || []}
      />
    );
  } catch (error) {
    console.error("Error rendering UserProfilePage:", error);
    return <p>Failed to load profile data.</p>;
  }
}
