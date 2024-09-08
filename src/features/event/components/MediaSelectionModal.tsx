import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useEffect, useState } from "react";
import { handleFieldChange } from "../eventActions";

const MediaSelectionModal = ({
  isOpen,
  onClose,
  setMedia,
}: {
  isOpen: boolean;
  onClose: () => void;
  setMedia: (media: File[]) => void;
}) => {
  const [selectedPredefinedMedia, setSelectedPredefinedMedia] = useState<
    string[]
  >([]);
  const [predefinedMedia, setPredefinedMedia] = useState<string[]>([]);
  const [showPredefined, setShowPredefined] = useState(false);

  useEffect(() => {
    const loadMedia = async () => {
      try {
        const response = await fetch("/api/fetchMedia");
        const media = await response.json();
        setPredefinedMedia(media);
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };
    loadMedia();
  }, []);

  const handleMediaSelect = (media: string) => {
    setSelectedPredefinedMedia((prev) =>
      prev.includes(media)
        ? prev.filter((item) => item !== media)
        : [...prev, media],
    );
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      const files = Array.from(fileInput.files);
      setMedia(files);
      for (const file of files) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = async () => {
          const base64data = reader.result as string;

          try {
            const response = await fetch("/api/uploadTempFile", {
              method: "POST",
              body: JSON.stringify({
                base64data,
                fileName: file.name,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (response.ok) {
              const result = await response.json();
              const fileUrl = result.filePath;
              const mediaType = file.type.startsWith("video/")
                ? "video"
                : "image";
              handleFieldChange("mediaPreviews", [
                { url: fileUrl, type: mediaType },
              ]);
            } else {
              const result = await response.json();
              console.error("Failed to upload file:", result.message);
            }
          } catch (error) {
            console.error("Error uploading file:", error);
          }
        };
      }

      fileInput.value = "";
    }
  };

  const handleSave = () => {
    if (selectedPredefinedMedia.length > 0) {
      const mediaItems = selectedPredefinedMedia.map((item) => ({
        url: item,
        type: item.endsWith(".mp4") ? "video" : "image",
      }));
      handleFieldChange("mediaPreviews", mediaItems);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select or Upload Media</DialogTitle>
          <DialogDescription>
            Choose to upload your own media or select from our predefined
            library.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center space-x-4">
          <Button
            variant={showPredefined ? "outline" : "default"}
            onClick={() => setShowPredefined(false)}
          >
            Upload Media
          </Button>
          <Button
            variant={showPredefined ? "default" : "outline"}
            onClick={() => setShowPredefined(true)}
          >
            Predefined Media
          </Button>
        </div>
        <div className="space-y-4 mt-4">
          {showPredefined ? (
            <div className="grid grid-cols-3 gap-4">
              {predefinedMedia.length > 0 ? (
                predefinedMedia.map((media, index) => (
                  <div
                    key={index}
                    className={`relative cursor-pointer ${
                      selectedPredefinedMedia.includes(media)
                        ? "border-2 border-blue-500"
                        : ""
                    }`}
                    onClick={() => handleMediaSelect(media)}
                  >
                    {media.endsWith(".mp4") ? (
                      <video
                        className="w-full h-24 object-cover"
                        src={media}
                        muted
                      />
                    ) : (
                      <Image
                        src={media}
                        alt={`Predefined media ${index + 1}`}
                        width={100}
                        height={100}
                        className="object-cover"
                      />
                    )}
                  </div>
                ))
              ) : (
                <p>Loading media...</p>
              )}
            </div>
          ) : (
            <div>
              <Label htmlFor="file-upload">Upload Media</Label>
              <Input
                id="file-upload"
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleUpload}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MediaSelectionModal;
