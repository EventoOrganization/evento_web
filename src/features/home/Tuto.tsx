"use client";
import Section from "@/components/layout/Section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  CircleUserRound,
  Compass,
  Filter,
  HeartHandshake,
  Plus,
  Search,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import FeaturesSection from "./FeaturesSection";

const Tuto = () => {
  const sectionRefs = {
    showcaseTitle: useRef<HTMLDivElement>(null),
    showcaseContent: useRef<HTMLDivElement>(null),
    createEventTitle: useRef<HTMLDivElement>(null),
    discoverTitle: useRef<HTMLDivElement>(null),
    profileTitle: useRef<HTMLDivElement>(null),
    showcaseImage1: useRef<HTMLImageElement>(null),
    showcaseImage2: useRef<HTMLImageElement>(null),
  };

  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  useEffect(() => {
    const observerOptions = {
      root: null, // Observe par rapport au viewport
      threshold: 0.3, // Déclenche à 30% de visibilité
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => {
            const newId = entry.target.id;
            if (!prev.includes(newId)) {
              return [...prev, newId];
            }
            return prev;
          });
        }
      });
    }, observerOptions);

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);
  return (
    <div className="">
      <Section className="gap-10 grid md:grid-cols-2 ">
        <div className="space-y-6 px-4 md:px-12 flex flex-col">
          <h2
            ref={sectionRefs.showcaseTitle}
            id="showcase-title"
            className={`transition-opacity transform duration-700 ${
              visibleSections.includes("showcase-title")
                ? "opacity-100 translate-y-0 motion-safe:animate-slideInLeft"
                : "opacity-0 translate-y-10"
            }`}
          >
            Showcase your events, build your community
          </h2>

          <p>
            Whether you&apos;re hosting wellness workshops, organising pop-ups,
            supperclubs, or an open-mic - all your events are in one place. By
            creating and sharing all your upcoming and past events - your
            profile is a hub for your guests to find out more about you and your
            happenings. Keep your community in the loop and attract new
            passionate individuals, they&apos;re only a click away.
          </p>
        </div>
        <div className="grid-cols-2 gap-2 md:gap-6 grid ">
          <Image
            ref={sectionRefs.showcaseImage1}
            id="showcase-image1"
            src={"/HOMEPAGE - SHOTS (2).png"}
            alt="tuto-create-event"
            className={cn("w-full object-cover  opacity-0", {
              "animate-slideInBottom opacity-100":
                visibleSections.includes("showcase-image1"),
            })}
            width={500}
            height={500}
          />
          <Image
            ref={sectionRefs.showcaseImage2}
            id="showcase-image2"
            src={"/HOMEPAGE - SHOTS (3).png"}
            alt="tuto-create-event"
            className={cn("w-full object-cover delay-200 opacity-0", {
              "animate-slideInBottom opacity-100":
                visibleSections.includes("showcase-image2"),
            })}
            width={500}
            height={500}
          />
        </div>
        <div className="space-y-6 px-6 md:px-12 flex flex-col lg:col-span-2">
          <p className="text-center text-eventoPurpleDark">
            Join hundreds of users on Evento to create meaningful experiences.
          </p>
          <Button variant={"eventoPrimary"} className="lg:w-fit self-center">
            <Link href="/profile" className="flex gap-2 items-center">
              <UserRound /> Create your Profile
            </Link>
          </Button>
        </div>
      </Section>
      <div className="border max-w-2xl mx-auto my-10"></div>
      <Section id="tuto-create-event" className="gap-6 px-0">
        <div className="space-y-6 px-8 md:px-12 max-w-2xl mx-auto lg:text-center">
          <h2
            ref={sectionRefs.createEventTitle}
            id="createEvent-title"
            className={`transition-opacity transform duration-700 ${
              visibleSections.includes("createEvent-title")
                ? "opacity-100 translate-y-0 motion-safe:animate-slideInLeft"
                : "opacity-0 translate-y-10"
            }`}
          >
            Creating events has never been this easy
          </h2>

          <p>
            No more chasing RSVPs or juggling messages— Evento makes organizing
            seamless. With features like customizable RSVP forms, co-hosting,
            limited capacity, and more, you can set up your event in minutes and
            focus on making it unforgettable.
          </p>
        </div>
        <FeaturesSection />
        <div className="space-y-6 px-6 md:px-12 flex flex-col ">
          <Button variant={"ghost"}>
            <Link
              href="/create-event"
              className="text-center text-eventoPurpleDark text-base"
            >
              Explore all Features
            </Link>
          </Button>
          <Button
            variant={"eventoPrimary"}
            className="lg:w-fit self-center"
            asChild
          >
            <Link href="/create-event" className="flex gap-2 items-center">
              <Plus />
              Create an Event
            </Link>
          </Button>
        </div>
      </Section>
      <div className="border max-w-2xl mx-auto my-10"></div>
      <Section
        id="tuto-discover-events"
        className="flex lg:grid lg:grid-cols-2 gap-10"
      >
        {/* Texte */}
        <div className="space-y-6 px-4 md:px-12 flex flex-col h-full gap-4">
          <h2
            ref={sectionRefs.discoverTitle}
            id="discover-title"
            className={`transition-opacity transform duration-700 ${
              visibleSections.includes("discover-title")
                ? "opacity-100 translate-y-0 motion-safe:animate-slideInLeft"
                : "opacity-0 translate-y-10"
            }`}
          >
            But that&apos;s not all, discover events that resonate with YOU !
          </h2>
          <p>
            At Evento we want you to feel seen, understood and share your
            interests with like-minded people. Explore the &quot;Discover
            Events&quot; page based on your favorite interests.
          </p>
          <Button
            variant={"eventoPrimary"}
            className="w-fit self-center hidden lg:flex"
            asChild
          >
            <Link href="/discover">
              <Compass />
              Discover Events
            </Link>
          </Button>
        </div>

        {/* Image */}
        <div className="flex justify-center px-4 flex-col items-center gap-10 text-sm lg:text-base">
          <h3>💡 Useful tips to discover events !</h3>
          <ul className="space-y-4">
            <li className="flex gap-2 items-start">
              <Filter className="text-eventoPurpleDark min-w-6 h-6" />
              <span>
                <b>Use filters for personalized discovery</b>
                <br /> Click on the filter icon at the top right to explore
                events in your preferred interest categories like
                &quot;wellness&quot;, &quot;food & beverage&quot; or
                &quot;fashion&quot;.{" "}
              </span>
            </li>
            <li className="flex gap-2 items-start">
              <Search className="text-eventoPurpleDark min-w-6 h-6" />
              <span>
                <b>Search for anything</b> <br />
                Looking for a specific event, venue, or even a friend? Just type
                it in the search bar—it&apos;s got you covered.
              </span>
            </li>
            <li className="flex gap-2 items-start">
              <CircleUserRound className="text-eventoPurpleDark min-w-6 h-6" />

              <span>
                <b>See where your friends are going</b> <br />
                Spot which friends are attending events you might love. Soon,
                you&apos;ll be able to message them directly through our chat
                feature!
              </span>
            </li>
            <li className="flex gap-2 items-start">
              <Bookmark className="text-eventoPurpleDark min-w-6 h-6" />
              <span>
                <b>Save events for later</b> <br /> Interested in an event but
                not ready to commit? Tap the bookmark icon to save it and find
                it later in your profile.
              </span>
            </li>
          </ul>
          <Button
            variant={"eventoPrimary"}
            className="w-fit self-center lg:hidden"
            asChild
          >
            <Link href="/discover">
              <Compass />
              Discover Events
            </Link>
          </Button>
        </div>
      </Section>
      <div className="border max-w-2xl mx-auto my-10"></div>
      <Section id="tuto-profile" className="grid md:grid-cols-3 gap-10">
        <div className="space-y-6 px-4 md:px-12 flex flex-col md:col-span-2">
          <h2
            ref={sectionRefs.profileTitle}
            id="profile-title"
            className={`transition-opacity transform duration-700 ${
              visibleSections.includes("profile-title")
                ? "opacity-100 translate-y-0 motion-safe:animate-slideInLeft"
                : "opacity-0 translate-y-10"
            }`}
          >
            The story behind Evento
          </h2>
          <p>
            It all started from our own challenges in hosting and finding great
            events.
          </p>

          <p>
            On one hand we have Camille, who loves bringing people
            together—organizing unforgettable nights, curating every detail to
            create the perfect atmosphere. Her love for hosting became so strong
            that she now runs her own venue in Ho Chi Minh City, where she hosts
            everything from sunset DJ sessions to outdoor cinemas.
          </p>

          <p>
            On the other hand, Elena is a seeker—always looking for unique
            experiences from niche festivals to wellness workshops. For her,
            events aren&apos;t just about being somewhere; they&apos;re about
            finding genuine moments of connection.
          </p>

          <p>
            But whether we were hosting events, or looking for them, we kept
            running into the same frustrations. Too much time was spent on
            messaging apps and social media. Scrolling to find relatable events,
            aggressively promoting to find the right audience or chasing after
            attendees.
          </p>

          <p>We kept asking ourselves—why isn&apos;t this easier?</p>

          <p>That&apos;s when Evento was born.</p>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="pt-0 text-sm text-eventoPink">
                Read more
              </AccordionTrigger>
              <AccordionContent className="text-base space-y-6">
                <p>
                  We realized this wasn&apos;t just our problem. As we started
                  talking about our idea, we realised that people crave
                  connection more than ever, yet it often feels harder to make
                  it happen and finding meaningful moments shouldn&apos;t be so
                  difficult.
                </p>

                <p>
                  Loneliness is as harmful as obesity or smoking, yet we rarely
                  talk about social health. We believe it&apos;s time to change
                  that.
                </p>

                <p>
                  With Evento, hosting and discovering events becomes
                  effortless. Whether you&apos;re planning an intimate
                  gathering, a public event, or looking to meet like-minded
                  people, Evento makes it simple.
                </p>

                <p>
                  Because life isn&apos;t just about what we do—it&apos;s about
                  who we share it with.
                </p>

                <p>
                  We&apos;re two best friends on a mission to inspire more
                  people to host, attend, and truly connect. To turn every event
                  into a memorable moment.
                </p>

                <p>
                  Thanks for being on this journey with us. Our door is always
                  open—reach out to us just to chat or to suggest improvements
                  for Evento. Let&apos;s build something meaningful together 💜
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <p className="text-lg md:text-xl leading-relaxed text-center lg:text-left font-semibold">
            Camille & Elena
            <br />
            Founders of Evento
          </p>

          <Button
            variant={"eventoPrimary"}
            className="md:w-fit self-center"
            asChild
          >
            <Link href="mailto:help@evento-app.io">
              <HeartHandshake />
              Contact us
            </Link>
          </Button>
        </div>
        <Image
          src="/story.png"
          alt="Camille & Elena"
          className="w-full object-cover max-w-[290px]"
          width={500}
          height={500}
        />
      </Section>
    </div>
  );
};

export default Tuto;
