import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

const ShareModal = ({ eventUrl }: { eventUrl: string }) => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      toast({
        title: "Link copied to clipboard!",
        description: "The event link has been copied. You can share it now.",
        className: "bg-evento-gradient text-white",
        duration: 3000,
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast({
        title: "Failed to copy",
        description: "Unable to copy the link to the clipboard.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this event",
          text: "Check out this event!",
          url: eventUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      toast({
        title: "Sharing not supported",
        description: "Your browser does not support sharing links directly.",
        variant: "destructive",
        duration: 3000,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant={"eventoPrimary"}
        className="w-full md:w-fit"
      >
        <ExternalLink /> Share link
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
            <h3 className="text-lg font-bold mb-4">Share Event</h3>
            <p className="text-gray-700 mb-4">
              Choose how you want to share the event link:
            </p>
            <div className="grid gap-4">
              <Button
                onClick={handleCopyToClipboard}
                className="bg-evento-gradient-button hover:opacity-80"
              >
                Copy Link
              </Button>
              <Button
                onClick={handleShare}
                className="bg-evento-gradient-button hover:opacity-80"
              >
                Share via Browser
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

export default ShareModal;
