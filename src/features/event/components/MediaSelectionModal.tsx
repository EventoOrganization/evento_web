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

const MediaSelectionModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [selectedPredefinedMedia, setSelectedPredefinedMedia] = useState<
    string[]
  >([]);
  const [mediaPreviews, setMediaPreviews] = useState<
    { url: string; type: string }[]
  >([]);
  const [predefinedMedia, setPredefinedMedia] = useState<string[]>([]);
  const [showPredefined, setShowPredefined] = useState(false);

  // Charger les médias prédéfinis au montage du composant
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

  // Sélectionner ou désélectionner un média prédéfini
  const handleMediaSelect = (media: string) => {
    setSelectedPredefinedMedia((prev) =>
      prev.includes(media)
        ? prev.filter((item) => item !== media)
        : [...prev, media],
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("file", file));

      try {
        const urls = await handleUpload(formData);
        if (urls) {
          const newMedia = urls.map((fileUrl: string, index: number) => {
            const file = files[index];
            const mediaType = file.type.startsWith("video/")
              ? "video"
              : "image";
            return { url: fileUrl, type: mediaType };
          });

          // Ajouter les nouveaux médias uploadés à mediaPreviews
          setMediaPreviews((prev) => [...prev, ...newMedia]);
          handleFieldChange("mediaPreviews", [...mediaPreviews, ...newMedia]);
        }
      } catch (error) {
        console.error("Error uploading files:", error);
      }
    }
  };

  // Enregistrer tous les médias (uploadés + prédéfinis)
  const handleSave = () => {
    // Médias prédéfinis sélectionnés
    const predefinedMediaItems = selectedPredefinedMedia.map((item) => ({
      url: item,
      type: item.endsWith(".mp4") ? "video" : "image",
    }));

    // Fusionner les médias uploadés avec les médias prédéfinis sélectionnés
    const allMediaItems = [...mediaPreviews, ...predefinedMediaItems];

    // Mettre à jour les mediaPreviews avec tous les médias
    handleFieldChange("mediaPreviews", allMediaItems);
    // Filtrer et mettre à jour les vidéos et images séparément si besoin
    const videos = allMediaItems.filter(
      (media) => media.type === "video" && media.url.startsWith("https://"),
    );
    const images = allMediaItems.filter(
      (media) => media.type === "image" && media.url.startsWith("https://"),
    );

    if (videos.length > 0) {
      handleFieldChange("videos", videos);
    }
    if (images.length > 0) {
      handleFieldChange("images", images);
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
                onChange={handleFileUpload}
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
