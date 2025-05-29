"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useState } from "react";

const ShareEventModal = ({ eventId }: { eventId: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleShareEvent = async () => {
    const eventUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/events/${eventId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this event!",
          text: "Don't miss out on this amazing event!",
          url: eventUrl,
        });
      } catch (error) {
        console.error("Error sharing event:", error);
        toast({
          title: "Failed to Share",
          description: "Unable to share the event.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Sharing Not Supported",
        description:
          "Your browser does not support the sharing feature. You can copy the link instead.",
        className: "bg-desctructive text-desctructive-foreground",
      });
    }
    setIsModalOpen(false);
  };

  const handleCopyToClipboard = async () => {
    const eventUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/events/${eventId}`;
    try {
      await navigator.clipboard.writeText(eventUrl);
      toast({
        title: "Link Copied!",
        description: "The event link has been copied to your clipboard.",
        className: "bg-evento-gradient text-white",
      });
    } catch (error) {
      console.error("Error copying link:", error);
      toast({
        title: "Failed to Copy",
        description: "Unable to copy the event link.",
        variant: "destructive",
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <Button
        onClick={(e) => {
          setIsModalOpen(true);
          e.stopPropagation();
        }}
        variant={"outline"}
        className={cn(
          "relative flex items-center justify-center bg-muted px-3 hover:opacity-80 text-sm  border-black",
        )}
      >
        <svg
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.15841 11.2584L11.8501 14.5751M11.8417 5.42509L6.15841 8.74176M16.5 4.16675C16.5 5.54746 15.3807 6.66675 14 6.66675C12.6193 6.66675 11.5 5.54746 11.5 4.16675C11.5 2.78604 12.6193 1.66675 14 1.66675C15.3807 1.66675 16.5 2.78604 16.5 4.16675ZM6.5 10.0001C6.5 11.3808 5.38071 12.5001 4 12.5001C2.61929 12.5001 1.5 11.3808 1.5 10.0001C1.5 8.61937 2.61929 7.50008 4 7.50008C5.38071 7.50008 6.5 8.61937 6.5 10.0001ZM16.5 15.8334C16.5 17.2141 15.3807 18.3334 14 18.3334C12.6193 18.3334 11.5 17.2141 11.5 15.8334C11.5 14.4527 12.6193 13.3334 14 13.3334C15.3807 13.3334 16.5 14.4527 16.5 15.8334Z"
            stroke="#18181B"
            strokeWidth="1.67"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 sm:px-0 h-screen w-screen"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                onClick={handleCopyToClipboard}
                className="flex-1 bg-evento-gradient-button hover:opacity-80"
              >
                Copy Link
              </Button>
              <Button
                variant="outline"
                onClick={handleShareEvent}
                className="flex-1"
              >
                Share via App
              </Button>
            </div>
            <Button
              variant="ghost"
              className="mt-4 w-full"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareEventModal;
