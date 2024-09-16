import Image from "next/image";
import Link from "next/link";

const HowItWorks = () => {
  const steps = [
    {
      title: "Browse Events",
      image: "/discover.webp",
      description: "Discover upcoming events in your area or around the world!",
      link: "/discover",
    },
    {
      title: "Create your own Event",
      image: "/create.webp",
      description: "Create your own event.",
      link: "/create-event",
    },
    {
      title: "Manage your Events",
      image: "/profile.webp",
      description: "Follow your upcoming and past events,.",
      link: "/profile",
    },
  ];

  return (
    <section className="how-it-works py-16 ">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-black text-eventoPink mb-8">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 md:flex-row justify-center gap-8 ">
          {steps.map((step, index) => (
            <Link
              href={step.link}
              key={index}
              className="border relative step p-4 bg-black shadow-md rounded-lg flex flex-col items-center aspect-square"
            >
              <Image
                src={step.image}
                alt={step.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="absolute w-full h-full rounded-lg inset-0 opacity-80"
                style={{ filter: "blur(2px)" }}
              />
              <h3 className="text-xl text-white font-black mb-2 z-10 p-4 rounded ">
                {step.title}
              </h3>
              <p className="text-white font-medium z-10">{step.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
