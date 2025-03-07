"use client";
import Section from "@/components/layout/Section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const StaticProfilePage = ({
  setIsAuthModalOpen,
  setIsSigninModalOpen,
}: {
  setIsAuthModalOpen: (value: boolean) => void;
  setIsSigninModalOpen: (value: boolean) => void;
}) => {
  return (
    <>
      <Section className="gap-6 grid md:grid-cols-2 md:pt-20 md:px-20 items-center min-h-screen">
        <div className="w-full lg:grid lg:grid-cols-3">
          <div className="col-span-2 self-start w-full max-w-lg text-center">
            <div className="flex items-center justify-center w-full mb-4">
              <div className="flex flex-col">
                <Avatar className="w-36 h-36 md:w-48 md:h-48">
                  <AvatarImage src="/evento-logo.png" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-3xl font-bold">Join Evento</h1>
              <p className="text-muted-foreground mt-2">
                Discover and host events easily on Evento.
              </p>
              <Button
                className="mt-4 bg-evento-gradient-button rounded-full text-white px-8"
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsSigninModalOpen(false);
                }}
              >
                Sign-up to create a profile
              </Button>
              <Button
                variant={"link"}
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsSigninModalOpen(true);
                }}
                className="text-muted-foreground"
              >
                Already have an account?{" "}
                <span className="font-bold text-eventoPurpleDark ml-2 underline">
                  Sign in
                </span>
              </Button>
            </div>
          </div>
        </div>

        <div className=" mt-8">
          <h2 className="text-2xl font-bold">Why Join Evento?</h2>
          <ul className="list-disc list-inside mt-4 text-muted-foreground text-left">
            <li>Create and host your events in a few clicks</li>
            <li>Explore events based on your interests </li>
            <li>Connect with other event attendees and hosts</li>
          </ul>
        </div>
      </Section>
    </>
  );
};

export default StaticProfilePage;
