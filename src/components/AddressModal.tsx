"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const AddressModal = ({ address }: { address?: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const handleOpenGoogleMaps = () => {
    if (address) {
      const encodedAddress = encodeURIComponent(address);
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      window.open(googleMapsUrl, "_blank");
    }
    setIsModalOpen(false);
  };

  const handleCopyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied to Clipboard",
        className: "bg-evento-gradient text-white",
      });
      setIsModalOpen(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={(e) => {
          setIsModalOpen(true);
          e.stopPropagation();
        }}
        className="py-0 max-w-full overflow-hidden text-left"
      >
        <span className="truncate text-muted-foreground block whitespace-nowrap overflow-hidden text-ellipsis">
          {address || "No Address Available"}
        </span>
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 sm:px-0 h-screen w-screen"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">Address Options</h3>
            <p className="text-gray-700 mb-4 truncate">
              {address || "No Address Available"}
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                onClick={handleCopyToClipboard}
                className="flex-1 bg-evento-gradient-button hover:opacity-80"
              >
                Copy Address
              </Button>
              <Button
                variant="outline"
                onClick={handleOpenGoogleMaps}
                className="flex-1"
              >
                Open in Google Maps
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

export default AddressModal;
