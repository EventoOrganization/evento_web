import { handleUpload } from "@/app/(views)/(prod)/create-event/action"; // Importing the upload function
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/contexts/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { EventType } from "@/types/EventType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useState } from "react";
import EventoLoader from "./EventoLoader";

interface MediaUploadProps {
  event: EventType;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ event }) => {
  const [files, setFiles] = useState<File[] | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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

      // Assuming URLs are separated by type
      const imageUrls = urls.filter(
        (url) => url.endsWith(".jpg") || url.endsWith(".png"),
      );
      const videoUrls = urls.filter((url) => url.endsWith(".mp4"));

      const body = {
        userId: event.user._id,
        eventId: event._id,
        images: imageUrls,
        videos: videoUrls,
        thumbnailVideo: videoUrls[0],
      };

      // Call API to store URLs in the database
      const response = await fetchData(
        "/events/storePostEventMedia",
        HttpMethod.POST,
        body,
        token,
      );
      console.log(response);
      toast({
        description: "Files uploaded and stored successfully.",
        className: "bg-green-500 text-white",
        duration: 3000,
      });
    } catch (error) {
      console.error("Upload or Store Failed", error);
      toast({
        description: "Upload or store failed. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
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
        {isUploading ? <EventoLoader /> : "Upload Media"}
      </Button>
    </div>
  );
};

export default MediaUpload;
