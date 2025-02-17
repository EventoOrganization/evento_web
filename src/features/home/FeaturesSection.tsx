import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
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
        "Collaborate with ease: share hosting duties with others. You can give co-hosts admin access or read-only, no risk of them f*ing up.",
    },
    {
      image: "/chat.png",
      title: "Chat - Coming Soon",
      description:
        "Connect with your guests and other attendees before and after your event. Or simply share cool events to your friends or community.",
    },
  ];
  const sliderSettings = {
    infinite: true,
    centerMode: true,
    centerPadding: "20px",
    slidesToShow: 1,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };
  return (
    <div>
      {/* ✅ CAROUSEL en mode mobile */}
      <div className="lg:hidden max-w-[330px] mx-auto relative overflow-hidden">
        <Slider {...sliderSettings} className="w-full ">
          {features.map((feature, index) => (
            <div
              key={index}
              className="px-1 py-6 h-full flex flex-col  mx-auto"
            >
              <div className="rounded-lg border bg-card text-card-foreground shadow-lg overflow-hidden flex flex-col h-full">
                <div className="p-0 w-full flex justify-center items-center">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={280}
                    height={280}
                    className="w-full max-w-[250px] h-[250px] object-contain"
                  />
                </div>
                <div className="p-4 text-left flex-1 flex flex-col gap-2">
                  <h3 className="text-lg font-bold ">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
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
              <h3 className="mb-2">{feature.title}</h3>
              <p>{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
