import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const Tuto = () => {
  return (
    <div className="bg-eventoPurpleDark w-full text-white py-10">
      <Section
        id="tuto-create-event"
        className="grid grid-cols-1 lg:grid-cols-2 gap-10"
      >
        <div className="flex justify-center">
          <Image
            src={
              "https://evento-media-bucket.s3.ap-southeast-2.amazonaws.com/tuto-create-event.png"
            }
            alt="tuto-create-event"
            width={200}
            height={200}
            className=""
          />
        </div>
        <div className="space-y-6 px-6 md:px-12 flex flex-col">
          <h2 className="text-3xl font-bold text-center lg:text-left">
            Your next gathering is just a few clicks away!
          </h2>
          <p className="text-lg md:text-xl leading-relaxed text-center lg:text-left">
            Plan your event effortlessly with customizable options for date,
            time, location, and privacy. Add co-hosts to share the spotlight,
            import guest lists in bulk or send personalized invites for a
            seamless setup. Set RSVP options and track responses in real-time,
            while fostering excitement with a built-in chat feature for
            attendees. After the event, relive the magic by creating a media
            gallery to share the memorable moments with your guests. Hosting has
            never been this simple—or this fun!
          </p>
          <Button className="bg-evento-gradient text-white hover:opacity-80 py-8 md:text-xl w-fit self-center">
            <Link href="/create-event">CREATE AN EVENT</Link>
          </Button>
        </div>
      </Section>
      <Section
        id="tuto-discover-events"
        className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10"
      >
        {/* Texte */}
        <div className="space-y-6 px-6 md:px-12 flex flex-col">
          <h2 className="text-3xl font-bold text-center lg:text-left">
            Find the perfect activities to enrich your social life!
          </h2>
          <p className="text-lg md:text-xl leading-relaxed text-center lg:text-left">
            Explore a diverse range of local and virtual events tailored to your
            interests! Our intuitive search feature allows you to filter by
            category, location, and keywords, making it easy to find what
            you&apos;re looking for. Bookmark your favorites to revisit later
            and enjoy personalized recommendations that keep your social
            calendar full. With Evento, every experience is a chance to connect,
            learn, and have fun!
          </p>
          <Button className="bg-evento-gradient text-white hover:opacity-80 py-8 md:text-xl w-fit self-center">
            <Link href="/discover">DISCOVER EVENTS</Link>
          </Button>
        </div>

        {/* Image */}
        <div className="flex justify-center">
          <Image
            src={
              "https://evento-media-bucket.s3.ap-southeast-2.amazonaws.com/tuto-discover-events.png"
            }
            alt="tuto-discover-events"
            width={400}
            height={400}
            className="object-cover"
          />
        </div>
      </Section>

      <Section
        id="tuto-profile"
        className="grid grid-cols-1 lg:grid-cols-2 gap-10"
      >
        {" "}
        <div className="flex justify-center">
          <Image
            src={
              "https://evento-media-bucket.s3.ap-southeast-2.amazonaws.com/tuto-profile.png"
            }
            alt="tuto-create-event"
            width={200}
            height={200}
            className=""
          />
        </div>
        <div className="space-y-6 px-6 md:px-12 flex flex-col">
          <h2 className="text-3xl font-bold text-center lg:text-left">
            Connecting with like-minded individuals has never been this easy!
          </h2>
          <p className="text-lg md:text-xl leading-relaxed text-center lg:text-left">
            Engage with other attendees through chat and discussion forums,
            fostering relationships before and after events. Follow your
            favorite hosts and discover like-minded individuals who share your
            passions. With our profile feature, showcase your interests and find
            events that resonate with you.
          </p>
          <Button className="bg-evento-gradient text-white hover:opacity-80 py-8 md:text-xl w-fit self-center">
            <Link href="/profile">CREATE A PROFILE</Link>
          </Button>
        </div>
      </Section>
    </div>
  );
};

export default Tuto;
