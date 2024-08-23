"use client";
import ComingSoon from "@/components/ComingSoon";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UserProfile = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  // Access the user and authentication state
  const user = useAuthStore((state) => state.user);
  console.log("User:", user);

  useEffect(() => {
    setIsMounted(true);

    if (user === null || user === undefined) {
      router.push("/signin");
    }
  }, [user, router]);

  // Prevent rendering on server-side
  if (!isMounted) return null;

  return (
    <div>
      {user ? (
        <>
          <h1>Welcome, {user.name}</h1>
          <p>Email: {user.email}</p>
        </>
      ) : (
        <>
          <p>No user is logged in.</p>
          <ComingSoon message="This page profile is under construction. Please check back later!" />
        </>
      )}
    </div>
  );
};

export default UserProfile;
