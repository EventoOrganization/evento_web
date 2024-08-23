"use client";
import ComingSoon from "@/components/ComingSoon";
import Section from "@/components/layout/Section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UserProfile = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Ensure the component is mounted before checking the user state
    setIsMounted(true);

    if (isMounted && !user) {
      router.push("/signin");
    }
  }, [user, router, isMounted]);

  // Prevent rendering until the component is mounted
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <h2 className="mt-10 md:mt-32">My profile</h2>
      {user ? (
        <Section className="justify-start flex-shrink flex-row">
          {user.profileImage ? (
            <Image
              src={user.profileImage}
              alt="user image"
              width={200}
              height={200}
            />
          ) : (
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          )}
          <div>
            <span>{user.eventsAttended}</span>
            <p>Event Attended</p>
          </div>
          <div>
            <span>{user.following}</span>
            <p>Following</p>
          </div>
        </Section>
      ) : (
        <>
          <p>No user is logged in.</p>
          <ComingSoon message="This page profile is under construction. Please check back later!" />
        </>
      )}
    </>
  );
};

export default UserProfile;
