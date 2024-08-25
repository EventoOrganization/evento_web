import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEventStore } from "@/store/useEventStore";
import { Film } from "lucide-react";
import { useState } from "react";

const EventVideoUpload = ({ field }: { field: any }) => {
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const eventStore = useEventStore();

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("Selected Video:", file);
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
      eventStore.setEventField("videoPreview", videoUrl);
    }
    field.onChange(file);
  };

  return (
    <FormItem>
      <FormLabel className="flex gap-2 items-center">
        <Film className="w-4 h-4" />
        Max 1 Video
      </FormLabel>
      <FormControl>
        <>
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => {
              field.onChange(e);
              handleVideoChange(e);
            }}
            className="text-sm text-muted-foreground"
          />
        </>
      </FormControl>
      {videoPreview && (
        <div
          className="video-preview-wrapper mt-4 relative w-full"
          style={{ paddingBottom: "56.25%" }}
        >
          <video
            controls
            className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
          >
            <source src={videoPreview} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </FormItem>
  );
};

export default EventVideoUpload;
