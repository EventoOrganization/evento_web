"use server";
import Hero from "@/features/home/Hero";
import Showcase from "@/features/home/Showcase";
import { getToken } from "@/utils/auth";

export default async function Home() {
  let events;

  const token = await getToken();
  const authHeader = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/allAndVirtualEventAndNear`,
      { credentials: "include", method: "POST", headers: authHeader },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    events = await response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
  }

  return (
    <>
      <Hero />
      <Showcase events={events.data} />
    </>
  );
}
