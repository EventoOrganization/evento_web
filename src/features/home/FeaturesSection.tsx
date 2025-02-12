import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const FeaturesSection = () => {
  const features = [
    {
      image: "/easy-invites-&-rsvp.png",
      title: "Easy Invites & RSVP",
      description:
        "Plan stress-free: Evento's integrated RSVP form gets you all the guest info you need. No more individual chasing.",
    },
    {
      image: "/photo-sharing.png",
      title: "Photo Sharing",
      description:
        "Capture memories: your guests can upload photos to your event page. You can always go back to check them on your past events.",
    },
    {
      image: "/co-hosting.png",
      title: "Co-Hosting",
      description:
        "Collaborate with ease: Share hosting duties with others. You can give co-hosts admin access or read-only, no risk of them f*ing up.",
    },
    {
      image: "/chat.png",
      title: "Chat - Coming Soon",
      description:
        "Connect with your guests and other attendees before and after your event. Or simply share cool events to your friends or community.",
    },
  ];

  return (
    <div>
      {/* ✅ CAROUSEL en mode mobile */}
      <div className="lg:hidden max-w-[330px] relative">
        <Carousel
          showThumbs={false}
          showStatus={false}
          showIndicators={true}
          infiniteLoop
          autoPlay
          interval={4000}
          className="w-full"
        >
          {features.map((feature, index) => (
            <div key={index} className="p-4">
              <Card className="space-y-4">
                <CardHeader className="p-0">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={1045}
                    height={1045}
                    className="w-full h-auto object-contain"
                  />
                </CardHeader>
                <CardContent className="text-left">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </Carousel>
      </div>

      {/* ✅ GRILLE affichée uniquement en `lg:grid-cols-4` */}
      <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-4">
        {features.map((feature, index) => (
          <Card key={index} className="space-y-4">
            <CardHeader className="p-0">
              <Image
                src={feature.image}
                alt={feature.title}
                width={1045}
                height={1045}
                className="w-full max-h-72 object-contain"
              />
            </CardHeader>
            <CardContent>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
