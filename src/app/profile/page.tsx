"use client";
import AuthModal from "@/features/auth/components/AuthModal";
import UserProfile from "@/features/profile/UserProfile";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useEffect } from "react";

export default function CurrentUserProfilePage() {
  const { user } = useAuthStore((state) => state);
  const token = user?.token;
  const profileStore = useProfileStore();

  // Function to fetch profile data
  const getProfileData = async (token: string) => {
    console.log("Fetching profile data with token:", token);
    try {
      const profileRes = await fetchData<any>(
        `/profile/getProfile`,
        HttpMethod.GET,
        null,
        token,
      );
      if (profileRes && profileRes.data) {
        profileStore.setProfileData(profileRes.data);
        console.log("Profile data fetched:", profileRes.data);
      } else {
        console.log("Failed to fetch profile data");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      console.log("Finished fetching profile data");
    }
  };

  useEffect(() => {
    // If the user exists and has a token, fetch profile data
    if (user && token) {
      getProfileData(token);
    }
  }, [token]); // Effect depends on `user` and `token`

  // Handler for AuthModal success
  const onAuthSuccess = (authToken: string) => {
    console.log("onAuthSuccess called with token:", authToken);
    getProfileData(authToken); // Fetch profile data after successful login
  };

  // Close handler for AuthModal (if needed)
  const onClose = () => {
    console.log("Auth modal closed");
  };

  // Conditional rendering: If user doesn't exist, show AuthModal
  if (!user) {
    return <AuthModal onAuthSuccess={onAuthSuccess} onClose={onClose} />;
  }

  // If user exists, render UserProfile
  return <UserProfile />;
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
