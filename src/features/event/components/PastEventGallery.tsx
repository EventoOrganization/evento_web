import { handleUpload } from "@/app/create-event/action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/Loader";
import { useSession } from "@/contexts/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { EventType } from "@/types/EventType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { PlayCircleIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import PastEventModal from "./PastEventModal";

// Define the MediaItem type
interface MediaItem {
  url: string;
  type: "image" | "video";
}

interface PastEventGalleryProps {
  event: EventType;
}

const PastEventGallery: React.FC<PastEventGalleryProps> = ({ event }) => {
  const [mediaItems, setMediaItems] = useState<any[]>(
    event.postEventMedia || [],
  );
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(
    null,
  );
  const [allUploadPhotoVideo, setAllUploadPhotoVideo] = useState(
    event.allUploadPhotoVideo || false,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<File[] | null>(null);
  const { toast } = useToast();
  const { token } = useSession();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };
  const handleUploadClick = async () => {
    if (!files || files.length === 0) {
      toast({
        description: "Please select files to upload.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    try {
      const folder = `events/postEventMedia/${event._id}`;
      setIsUploading(true);
      const urls = await handleUpload(formData, folder);

      // Determine media type and update mediaItems state
      const newMediaItems: MediaItem[] = urls.map((url) => ({
        url,
        type: url.endsWith(".mp4") || url.endsWith(".MP4") ? "video" : "image",
      }));
      setMediaItems([...mediaItems, ...newMediaItems]);

      // Send the new media items to the backend to store
      const body = {
        eventId: event._id,
        media: newMediaItems, // No need to merge with the old media
      };
      await fetchData(
        "/events/storePostEventMedia",
        HttpMethod.POST,
        body,
        token,
      );
      toast({
        description: "Files uploaded successfully.",
        className: "bg-evento-gradient text-white",
        duration: 3000,
      });
    } catch (error) {
      console.error("Upload Failed", error);
      toast({
        description: "Upload failed. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsUploading(false);
    }
  };
  const handleMediaDelete = (index: number) => {
    setMediaItems((prevItems) => prevItems.filter((_, i) => i !== index)); // Remove the deleted media from state
  };
  const openModal = (index: number) => {
    setSelectedMediaIndex(index);
  };

  const closeModal = () => {
    setSelectedMediaIndex(null);
  };
  const handleAllUploadPhotoVideo = async () => {
    try {
      const body = {
        eventId: event._id,
        allow: !allUploadPhotoVideo,
      };
      const response = await fetchData(
        "/events/toggle-upload-media",
        HttpMethod.PATCH,
        body,
        token,
      );
      if (response.ok) {
        toast({
          description: "Files uploaded successfully.",
          className: "bg-evento-gradient text-white",
          duration: 3000,
        });
      } else {
        toast({
          description: "Upload failed. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      }
      setAllUploadPhotoVideo(!allUploadPhotoVideo);
    } catch (error) {
      console.error("Upload Failed", error);
      toast({
        description: "Upload failed. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  return (
    <div className="w-full md:p-4 pb-20 md:pb-32">
      <div className="flex flex-col space-y-2">
        {(event.isAdmin || event.isHosted || event.allUploadPhotoVideo) && (
          <>
            <div className="flex justify-between">
              <h4>This Event is past. Add media!</h4>
              <Button onClick={handleAllUploadPhotoVideo}>
                {allUploadPhotoVideo ? "unAllow" : "Allow"}
              </Button>
            </div>
            <div className="flex justify-between gap-2">
              <Input
                type="file"
                onChange={handleFileChange}
                multiple
                accept="image/*,video/*"
                className="cursor-pointer"
              />
              <Button
                onClick={handleUploadClick}
                disabled={isUploading || !files || files.length === 0}
              >
                {isUploading ? <Loader /> : "Upload Media"}
              </Button>
            </div>
          </>
        )}
      </div>

      {mediaItems.length > 0 && (
        <>
          <h3 className="text-eventoPurpleLight pt-4">Remember this event!</h3>
          <div className="grid grid-cols-3 gap-1 bg-evento-gradient/20">
            {mediaItems.map((media, index) => (
              <div
                key={index}
                className="relative cursor-pointer aspect-square"
                onClick={() => openModal(index)} // Open the modal when clicking a media
              >
                {media.type === "image" ? (
                  <Image
                    src={media.url}
                    alt={`Gallery image ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full object-cover">
                    <video
                      width={100}
                      height={100}
                      src={media.url}
                      className="w-full h-full object-cover"
                    ></video>
                    <PlayCircleIcon
                      strokeWidth={1.5}
                      className="w-10 h-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-evento-gradient text-white opacity-80 rounded-full"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>{" "}
        </>
      )}
      {selectedMediaIndex !== null && (
        <PastEventModal
          mediaItems={mediaItems}
          selectedMediaIndex={selectedMediaIndex}
          onClose={closeModal}
          eventId={event._id}
          onMediaDelete={handleMediaDelete} // Pass the callback to the modal
        />
      )}
    </div>
  );
};

export default PastEventGallery;
