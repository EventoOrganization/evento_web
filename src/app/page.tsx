"use server";
import Hero from "@/features/home/Hero";
import Showcase from "@/features/home/Showcase";
import { fetchDataFromApi } from "@/utils/fetchData";
export default async function Home() {
  let events;
  try {
    const data = await fetchDataFromApi(
      `${process.env.NEXT_PUBLIC_API_URL}/users/allAndVirtualEventAndNear`,
      "POST",
    );

    events = data;
  } catch (error) {
    console.error("Error fetching events:", error);
  }

  return (
    <>
      <Hero />
      <Showcase events={events?.data} />
    </>
  );
}
