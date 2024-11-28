import { handleUpload } from "@/app/create-event/action"; // Importer votre fonction d'upload
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
import EventoLoader from "@/components/EventoLoader";

const MediaSelectionModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  // const [selectedPredefinedMedia, setSelectedPredefinedMedia] = useState<
  //   string[]
  // >([]);
  const [tempMediaPreviews, setTempMediaPreviews] = useState<
    { url: string; type: string }[]
  >([]); // Temporary previews for display
  const [predefinedMedia, setPredefinedMedia] = useState<string[]>([]);
  // const [showPredefined, setShowPredefined] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const showPredefined = false;
  const selectedPredefinedMedia = [] as any;
  // Load predefined media when the component mounts
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

  // Generate temporary previews and store them in the state
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const previews = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video/") ? "video" : "image",
      }));

      // Add the temporary previews to the state
      setTempMediaPreviews((prev) => [...prev, ...previews]);
      handleFieldChange("TempMediaPreview", [
        ...tempMediaPreviews,
        ...previews,
      ]);
    }
  };

  // Trigger the actual file upload on Save
  const handleSave = async () => {
    const filesInput = document.getElementById(
      "file-upload",
    ) as HTMLInputElement;
    const files = filesInput?.files;

    if (files && files.length > 0) {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("file", file));

      try {
        setIsUploading(true);
        // Perform the upload and get the actual URLs
        const urls = await handleUpload(formData);
        if (urls) {
          const uploadedMedia = urls.map((fileUrl: string, index: number) => ({
            url: fileUrl,
            type: files[index].type.startsWith("video/") ? "video" : "image",
          }));

          // Update media previews with the actual uploaded URLs
          handleFieldChange("mediaPreviews", [...uploadedMedia]);
        }
      } catch (error) {
        console.error("Error uploading files:", error);
      } finally {
        setIsUploading(false);
      }
    }

    // Merge predefined media and uploaded media
    const predefinedMediaItems = selectedPredefinedMedia.map(
      (item: string) => ({
        url: item,
        type: item.endsWith(".mp4") ? "video" : "image",
      }),
    );

    // Update the store with all media
    const allMediaItems = [...predefinedMediaItems];
    handleFieldChange("mediaPreviews", allMediaItems);

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select or Upload Media</DialogTitle>
          <DialogDescription>
            Choose to upload your own media
            {/* or select from our predefined library. */}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center space-x-4">
          {/* <Button
            variant={showPredefined ? "outline" : "default"}
            onClick={() => setShowPredefined(false)}
          >
            Upload Media
          </Button> */}
          {/* <Button
            variant={showPredefined ? "default" : "outline"}
            onClick={() => setShowPredefined(true)}
          >
            Predefined Media
          </Button> */}
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
                    // onClick={() => handleMediaSelect(media)}
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
                className="cursor-pointer"
                accept="image/*,video/*"
                multiple
                onChange={handleFileSelect}
              />
              {/* Display temporary previews */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                {tempMediaPreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    {preview.type === "video" ? (
                      <video
                        className="w-full h-24 object-cover"
                        src={preview.url}
                        muted
                      />
                    ) : (
                      <Image
                        src={preview.url}
                        alt={`Preview media ${index + 1}`}
                        width={100}
                        height={100}
                        className="object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isUploading}>
            {isUploading ? <EventoLoader /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MediaSelectionModal;
