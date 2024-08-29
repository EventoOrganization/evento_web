// src/app/discover/page.tsx
"use client";
import Showcase from "@/components/Showcase";
import { useDiscoverContext } from "@/contexts/DiscoverContext";

const DiscoverPage = () => {
  const { interests, events, users } = useDiscoverContext();
  console.log(interests);

  return (
    <>
      <Showcase events={events} />
      <Showcase users={users} />
    </>
  );
};

export default DiscoverPage;
