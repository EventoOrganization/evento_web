"use client";
import {
  handleDeleteMedia,
  handleUpload,
} from "@/app/(views)/(prod)/create-event/action";
import EventoLoader from "@/components/EventoLoader";
import FileUploadButton from "@/components/FileUploadButton";
import SmartImage from "@/components/SmartImage";
import { useSession } from "@/contexts/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { MediaItem, useCreateEventStore } from "@/store/useCreateEventStore";
import { useEventStore } from "@/store/useEventsStore";
import { EventType } from "@/types/EventType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { Trash } from "lucide-react";
import { useState } from "react";
const EditEventMedia = ({
  event,
  handleUpdateField,
}: {
  event: EventType;
  handleUpdateField: (field: string, value: any) => void;
}) => {
  const { updateEvent } = useEventStore();
  const { toast } = useToast();
  const getMediaType = (mimeType: string): "image" | "video" => {
    return mimeType.startsWith("video/") ? "video" : "image";
  };
  const { token } = useSession();
  const [initialMedia, setInitialMedia] = useState<MediaItem[]>(
    event.initialMedia.map((media) => ({
      url: media.url,
      type: getMediaType(media.type),
    })),
  );
  const [tempMediaPreviews, setTempMediaPreviews] = useState<MediaItem[]>([]);

  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPreviews: MediaItem[] = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      type: getMediaType(file.type),
    }));

    setTempMediaPreviews((prev) => [...prev, ...newPreviews]);

    const uploadedMedia: MediaItem[] = await Promise.all(
      newPreviews.map((media) => uploadMedia(media)),
    );

    const updatedMediaList = [...initialMedia, ...uploadedMedia];
    await updateEventMedia(updatedMediaList);
    updateEvent(event._id, { initialMedia: [updatedMediaList[0]] });
    setInitialMedia(updatedMediaList);
    handleUpdateField("initialMedia", updatedMediaList);
    setTempMediaPreviews(tempMediaPreviews.filter((_, i) => i !== 0));
    toast({
      title: "Success",
      description: "Media uploaded successfully",
      className: "bg-evento-gradient text-white",
    });
  };

  const uploadMedia = async (media: MediaItem): Promise<MediaItem> => {
    try {
      setIsUploading(true);

      const formData = new FormData();
      const file = await fetch(media.url).then((r) => r.blob());
      formData.append("file", file);

      const urls = await handleUpload(formData, "events/initialMedia");
      const s3Url = urls[0];

      return { url: s3Url, type: media.type };
    } catch (error) {
      console.error("Error uploading media:", error);
      toast({
        title: "Error",
        description: "Failed to upload media",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteMedia = async (index: number, mediaItem: MediaItem) => {
    const isUploaded = mediaItem.url.startsWith(
      "https://evento-media-bucket.s3.",
    );

    if (isUploaded) {
      const fileKey = new URL(mediaItem.url).pathname.substring(1);
      const success = await handleDeleteMedia(fileKey);

      if (success) {
        const newMediaList = initialMedia.filter((_, i) => i !== index);

        await updateEventMedia(newMediaList);
        updateEvent(event._id, { initialMedia: [newMediaList[0]] });
        setInitialMedia(newMediaList);
        handleUpdateField("initialMedia", newMediaList);
        toast({
          title: "Success",
          description: "Media deleted successfully",
          className: "bg-evento-gradient text-white",
        });
      }
    } else {
      useCreateEventStore.setState((state) => ({
        tempMediaPreview: state.tempMediaPreview?.filter((_, i) => i !== index),
      }));
    }
  };

  const updateEventMedia = async (updatedMedia: MediaItem[]) => {
    console.log("Updating event media:", updatedMedia);
    try {
      const response = await fetchData(
        `/events/updateEvent/${event._id}`,
        HttpMethod.PUT,
        { field: "initialMedia", value: updatedMedia },
        token,
      );

      if (!response.ok) {
        throw new Error("Failed to update event media");
      }
    } catch (error) {
      console.error("❌ Error updating event media:", error);
    }
  };

  return (
    <div className="flex p-2 w-full">
      <ul className="grid grid-cols-2 w-full gap-2 p-2">
        <FileUploadButton
          onChange={handleFileSelect}
          className="h-full m-0 aspect-square"
        />
        {initialMedia.map((media, index) => (
          <li
            key={index}
            className="cursor-pointer relative  overflow-hidden aspect-square border rounded-md flex-shrink-0 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:ring-2 hover:ring-ring"
          >
            {/* Afficher l'image ou la vidéo selon le type */}
            {media.type === "image" ? (
              <SmartImage
                src={media.url}
                alt={`Media ${index}`}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            ) : (
              <video
                src={media.url}
                controls
                className="object-cover w-full h-full"
              />
            )}

            <Trash
              className="absolute top-2 right-2 w-10 h-10 cursor-pointer rounded bg-background p-2 border hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => deleteMedia(index, media as MediaItem)}
            />
          </li>
        ))}
        {tempMediaPreviews.map((media, index) => (
          <li
            key={index}
            className="cursor-pointer relative  overflow-hidden aspect-square border rounded-md flex-shrink-0 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:ring-2 hover:ring-ring"
          >
            {media.type === "image" ? (
              <SmartImage
                src={media.url}
                alt={`Media ${index}`}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            ) : (
              <video
                src={media.url}
                controls
                className="object-cover w-full h-full"
              />
            )}
          </li>
        ))}
        {isUploading && <EventoLoader />}
      </ul>
    </div>
  );
};

export default EditEventMedia;
