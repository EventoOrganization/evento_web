"use client";
import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
// src/app/profile/page.tsx
import UserProfile from "@/features/profile/UserProfile";

export default function CurrentUserProfilePage() {
  const onAuthSuccess = () => {};
  const onClose = () => {};
  try {
    const { user } = useSession();
    if (!user) {
      return <AuthModal onAuthSuccess={onAuthSuccess} onClose={onClose} />;
    } else {
      return <UserProfile />;
    }
  } catch (error) {
    return "Error";
  }
  //   const user = useAuthStore((state) => state.user);
  //   const {
  //     userInfo,
  //     upcomingEvents,
  //     pastEvents,
  //     filteredUpcomingEventsAttened,
  //     setProfileData,
  //   } = useProfileStore();
  //   const [isLoading, setIsLoading] = useState(true);
  //   const [error, setError] = useState<string | null>(null);
  //   const profile = useProfileStore((state) => state);
  //   useEffect(() => {
  //     if (!user) {
  //       setIsLoading(false);
  //       return;
  //     }
  //     const fetchProfile = async () => {
  //       try {
  //         // Fetch the user's profile
  //         const profileDataResponse = await fetch(
  //           `${process.env.NEXT_PUBLIC_API_URL}/users/getProfileByUserId`,
  //           {
  //             method: "GET",
  //             credentials: "include",
  //             headers: {
  //               "Content-Type": "application/json",
  //               Authorization: `Bearer ${user?.token}`,
  //             },
  //           },
  //         );

  //         if (!profileDataResponse.ok) {
  //           throw new Error("Failed to fetch profile data.");
  //         }

  //         const profileDataJson = await profileDataResponse.json();
  //         console.log("profile fetch data", profileDataJson.body);

  //         // Set the profile data and events in the store
  //         setProfileData(profileDataJson.body);
  //       } catch (error) {
  //         setError(
  //           error instanceof Error
  //             ? error.message
  //             : "An unexpected error occurred.",
  //         );
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     };

  //     fetchProfile();
  //   }, [user, setProfileData]);

  //   if (!user) {
  //     return (
  //       <div>
  //         You need to log in to view this page.{" "}
  //         <Link href="/signin">Sign in</Link>
  //       </div>
  //     );
  //   }

  //   if (isLoading) {
  //     return <div>Loading...</div>;
  //   }

  //   if (error) {
  //     return <div>Error: {error}</div>;
  //   }

  //   if (!userInfo) {
  //     return <div>Profile data is loading...</div>;
  //   }
  //   if (!user) {
  //     return (
  //       <>
  //         <p>No user is logged in. Please log in. </p>
  //         <Link href="/signin">Login here</Link>
  //       </>
  //     );
  //   }
  //   return (
  //     <UserProfile
  //       profile={profile}
  //       upcomingEvents={filteredUpcomingEventsAttened}
  //       pastEvents={pastEvents}
  //       hostingEvents={upcomingEvents}
  //     />
  //   );
}
