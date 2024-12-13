import { handleUpload } from "@/app/create-event/action";
import EventoLoader from "@/components/EventoLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/togglerbtn";
import { useSession } from "@/contexts/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { EventType } from "@/types/EventType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { PlayCircleIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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
  console.log("selectedMediaIndex", selectedMediaIndex);
  // const handleMediaDelete = (index: number) => {
  //   setMediaItems((prevItems) => prevItems.filter((_, i) => i !== index)); // Remove the deleted media from state
  // };
  const openModal = (index: number) => {
    setSelectedMediaIndex(index);
  };

  // const closeModal = () => {
  //   setSelectedMediaIndex(null);
  // };
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
          description: `Files uploaded ${allUploadPhotoVideo ? "disallowed" : "allowed"} successfully.`,
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
      {event.isHosted && (
        <div className="flex items-center gap-2 justify-between ">
          <Switch
            checked={allUploadPhotoVideo}
            onCheckedChange={handleAllUploadPhotoVideo}
          />
          {(allUploadPhotoVideo || event.isHosted) && (
            <div>
              <Input
                id="gallery-file-upload"
                type="file"
                onChange={handleFileChange}
                multiple
                accept="image/*,video/*"
                className="sr-only"
              />

              {isUploading ? (
                <EventoLoader />
              ) : (
                <Button
                  className="bg-eventoPurpleDark hover:bg-eventoPurpleDark/80"
                  onClick={() => files && handleUploadClick()}
                >
                  <Label
                    htmlFor="gallery-file-upload"
                    className="cursor-pointer"
                  >
                    {files ? ` Upload ${files.length} Files` : "Select Media"}
                  </Label>
                </Button>
              )}
            </div>
          )}
        </div>
      )}
      {mediaItems.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-1 bg-evento-gradient/20">
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
      {/* {selectedMediaIndex !== null && (
        <PastEventModal
          mediaItems={mediaItems}
          selectedMediaIndex={selectedMediaIndex}
          onClose={closeModal}
          eventId={event._id}
          onMediaDelete={handleMediaDelete} // Pass the callback to the modal
        />
      )} */}
    </div>
  );
};

export default PastEventGallery;
