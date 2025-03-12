import { handleUpload } from "@/app/create-event/action";
import EventoLoader from "@/components/EventoLoader";
import SmartImage from "@/components/SmartImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/togglerbtn";
import { useSession } from "@/contexts/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { EventType } from "@/types/EventType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { PlayCircleIcon, Trash } from "lucide-react";
import { useMemo, useRef, useState } from "react";
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();
  const { token, user } = useSession();
  const isAdmin =
    user?._id === event.user._id ||
    event.coHosts?.some((host) => host._id === user?._id);

  const loggedUserId = user?._id;
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };
  const handleMediaDelete = (index: number) => {
    setMediaItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };
  const closeModal = () => {
    setSelectedMediaIndex(null);
  };
  const groupedMedia = useMemo(() => {
    const userMediaMap = new Map();

    mediaItems.forEach((media) => {
      const user = media.userId;
      if (user) {
        if (!userMediaMap.has(user._id)) {
          userMediaMap.set(user._id, {
            username: user.username,
            userId: user._id,
            profileImage: user.profileImage,
            mediaFiles: [media],
          });
        } else {
          userMediaMap.get(user._id).mediaFiles.push(media);
        }
      }
    });

    return Array.from(userMediaMap.values());
  }, [mediaItems]);

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
        userId: user?._id,
      }));
      setMediaItems([...mediaItems, ...newMediaItems]);

      // Send the new media items to the backend to store
      const body = {
        eventId: event._id,
        media: newMediaItems, // No need to merge with the old media
      };
      const response = await fetchData<any>(
        "/events/storePostEventMedia",
        HttpMethod.POST,
        body,
        token,
      );
      if (response.ok) {
        toast({
          description: "Files uploaded successfully.",
          className: "bg-evento-gradient text-white",
          duration: 3000,
        });
      }
      setMediaItems(response.data.postEventMedia);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setFiles(null);
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
  const deleteMedia = async (index: number, mediaItem: MediaItem) => {
    console.log("🗑️ Suppression du média :", mediaItem.url);

    try {
      const response = await fetchData(
        `/events/deletePostEventMedia/${event._id}`,
        HttpMethod.DELETE,
        { mediaUrl: mediaItem.url.trim() },
        token,
      );

      console.log("🔍 Réponse suppression :", response);

      if (response.ok) {
        toast({
          title: "Success",
          description: "Media deleted successfully",
          className: "bg-evento-gradient text-white",
        });

        setMediaItems((prevItems) =>
          prevItems.filter((item) => item.url !== mediaItem.url),
        );
      }
    } catch (error) {
      console.error("❌ Failed to delete media from event", error);
      toast({
        title: "Error",
        description: "Failed to delete media from event",
        variant: "destructive",
      });
    }
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
      <div className="flex w-full items-center gap-2 justify-between  pb-4 mb-4">
        {event.isHosted && (
          <div className="flex items-center gap-2 justify-between ">
            <Switch
              checked={allUploadPhotoVideo}
              onCheckedChange={handleAllUploadPhotoVideo}
            />
          </div>
        )}
        {((allUploadPhotoVideo && event.isGoing) || event.isHosted) && (
          <div className="border-b-2 flex justify-between w-full items-center pb-4">
            {isAdmin ? (
              <p className="text-sm">
                {allUploadPhotoVideo
                  ? "Your guests are allowed to upload media"
                  : "You only are allowed to upload media"}
              </p>
            ) : (
              <p className="text-sm">You are not allowed to upload media</p>
            )}
            <div>
              <Input
                id="gallery-file-upload"
                type="file"
                onChange={handleFileChange}
                multiple
                accept="image/*,video/*"
                className="hidden"
                ref={fileInputRef}
              />

              {isUploading ? (
                <EventoLoader />
              ) : (
                <Button
                  className="bg-eventoPurpleDark hover:bg-eventoPurpleDark/80 p-0"
                  onClick={() => files && handleUploadClick()}
                >
                  <Label
                    htmlFor="gallery-file-upload"
                    className="cursor-pointer w-full h-full flex justify-center items-center px-2"
                  >
                    {files ? ` Upload ${files.length} Files` : "Select Media"}
                  </Label>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      {groupedMedia.map((user, index) => (
        <div key={index} className="mb-4">
          {/* Profil utilisateur */}
          <div className="flex items-center gap-2 p-2">
            <SmartImage
              src={user.profileImage || "/default-avatar.png"}
              alt={`${user.username}'s profile`}
              width={40}
              height={40}
              className="rounded-full"
              forceImg
            />
            <div>
              <p className="font-bold">{user.username}</p>
              <p className="text-sm text-gray-500">
                {user.mediaFiles.length}{" "}
                {user.mediaFiles.length > 1 ? "media files" : "media file"}
              </p>
            </div>
          </div>

          {/* Médias de l'utilisateur */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {user.mediaFiles.map((media: MediaItem, mediaIndex: number) => (
              <div
                key={mediaIndex}
                className="relative cursor-pointer h-52 shadow border rounded-xl"
                onClick={() => setSelectedMediaIndex(mediaIndex)}
              >
                {media.type === "image" ? (
                  <SmartImage
                    src={media.url}
                    alt={`Media file ${mediaIndex + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      width={100}
                      height={100}
                      src={media.url}
                      className="w-full h-full object-cover rounded-xl"
                      controls
                    ></video>
                    <PlayCircleIcon
                      strokeWidth={1.5}
                      className="w-10 h-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-evento-gradient text-white opacity-80 rounded-full"
                    />
                  </div>
                )}{" "}
                {(isAdmin || loggedUserId === user.userId) && (
                  <Trash
                    className="absolute top-2 right-2 w-10 h-10 cursor-pointer rounded bg-background p-2 border hover:bg-destructive hover:text-destructive-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMedia(index, media as MediaItem);
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      {mediaItems.length === 0 && (
        <p>
          {allUploadPhotoVideo
            ? event.isGoing
              ? "No media uploaded yet. Upload the first media!"
              : "No media uploaded yet. You need to be going to post media."
            : "Sorry, you are not allowed to upload media."}
        </p>
      )}

      {selectedMediaIndex !== null && (
        <PastEventModal
          mediaItems={mediaItems}
          selectedMediaIndex={selectedMediaIndex}
          onClose={closeModal}
          eventId={event._id}
          onMediaDelete={handleMediaDelete}
        />
      )}
    </div>
  );
};

export default PastEventGallery;
