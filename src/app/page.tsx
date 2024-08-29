"use server";
import Hero from "@/features/home/Hero";
import HowItWorks from "@/features/home/HowItWorks";
import Testimonials from "@/features/home/Testimonials";
export default async function Home() {
  const testimonials = [
    {
      // photo: "/path/to/photo1.jpg",
      name: "Jane Doe",
      quote: "This product changed my life!",
      position: "CEO",
      company: "TechCorp",
    },
    {
      // photo: "/path/to/photo2.jpg",
      name: "John Smith",
      quote: "Outstanding service and quality.",
      position: "CTO",
      company: "InnovateX",
    },
    {
      photo: "/path/to/photo3.jpg",
      name: "Alice Johnson",
      quote: "I would highly recommend this to anyone.",
    },
  ];

  return (
    <>
      <Hero />
      <HowItWorks />
      <Testimonials testimonials={testimonials} />
    </>
  );
}
