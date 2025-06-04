import {
  handleDeleteMedia,
  handleUpload,
} from "@/app/(views)/(prod)/create-event/action";
import { useToast } from "@/hooks/use-toast";
import { MediaItem, useCreateEventStore } from "@/store/useCreateEventStore";
import { convertHEICtoJPEG, resizeImage } from "@/utils/eventMediaUtils";
import { useEffect, useState } from "react";

export const useEventMediaHandler = () => {
  const { toast } = useToast();
  const [tempMediaPreviews, setTempMediaPreviews] = useState<MediaItem[]>(
    useCreateEventStore.getState().tempMediaPreview || [],
  );
  const [uploadingMediaStatus, setUploadingMediaStatus] = useState<boolean[]>(
    Array(tempMediaPreviews.length).fill(false),
  );

  const cleanupInvalidTemp = (index: number) => {
    setTempMediaPreviews((prev) => prev.filter((_, i) => i !== index));
    useCreateEventStore.setState((state) => ({
      tempMediaPreview: state.tempMediaPreview?.filter((_, i) => i !== index),
    }));
  };

  const uploadMedia = async (media: MediaItem, index: number) => {
    try {
      setUploadingMediaStatus((prev) =>
        prev.map((s, i) => (i === index ? true : s)),
      );
      const blob = await fetch(media.url).then((r) => r.blob());

      if (media.type === "image") {
        const [thumb, medium] = await Promise.all([
          resizeImage(blob, 300),
          resizeImage(blob, 800),
        ]);

        const uploadBlob = async (b: Blob) => {
          const fd = new FormData();
          fd.append("file", b);
          const [url] = await handleUpload(fd, "events/initialMedia");
          return url;
        };

        const [thumbUrl, mediumUrl, fullUrl] = await Promise.all([
          uploadBlob(thumb),
          uploadBlob(medium),
          uploadBlob(blob),
        ]);

        useCreateEventStore.setState((state) => ({
          tempMediaPreview: state.tempMediaPreview?.filter(
            (_, i) => i !== index,
          ),
          mediaPreviews: [
            ...state.mediaPreviews,
            {
              type: "image",
              url: fullUrl,
              thumbnailUrl: thumbUrl,
              mediumUrl: mediumUrl,
            },
          ],
        }));
      } else if (media.type === "video") {
        const formData = new FormData();
        formData.append("file", blob);
        const [videoUrl] = await handleUpload(formData, "events/initialMedia");

        useCreateEventStore.setState((state) => ({
          tempMediaPreview: state.tempMediaPreview?.filter(
            (_, i) => i !== index,
          ),
          mediaPreviews: [
            ...state.mediaPreviews,
            { type: "video", url: videoUrl },
          ],
        }));
      }

      setTempMediaPreviews((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Upload error:", error);
      cleanupInvalidTemp(index);
      toast({
        title: "Upload failed",
        description: "Media couldn't be uploaded.",
        className: "bg-red-500 text-white",
      });
    } finally {
      setUploadingMediaStatus((prev) =>
        prev.map((s, i) => (i === index ? false : s)),
      );
    }
  };

  useEffect(() => {
    tempMediaPreviews.forEach((media, index) => {
      if (!uploadingMediaStatus[index]) {
        fetch(media.url)
          .then((res) =>
            res.ok ? uploadMedia(media, index) : cleanupInvalidTemp(index),
          )
          .catch(() => cleanupInvalidTemp(index));
      }
    });
  }, [tempMediaPreviews]);

  const deleteMedia = async (index: number, mediaItem: MediaItem) => {
    const urlsToDelete = [
      mediaItem.url,
      mediaItem.thumbnailUrl,
      mediaItem.mediumUrl,
    ].filter((url) => url?.startsWith("https://evento-media-bucket.s3."));

    const deletionResults = await Promise.all(
      urlsToDelete.map((url) =>
        handleDeleteMedia(new URL(url!).pathname.substring(1)),
      ),
    );

    const allDeleted = deletionResults.every(Boolean);

    if (allDeleted) {
      useCreateEventStore.setState((state) => ({
        mediaPreviews: state.mediaPreviews?.filter((_, i) => i !== index),
      }));
    } else {
      console.warn("Some media not deleted.");
    }

    if (!urlsToDelete.length) {
      cleanupInvalidTemp(index);
    }
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const heicFiles = fileArray.filter((f) =>
      f.name.toLowerCase().endsWith(".heic"),
    );

    if (heicFiles.length) {
      toast({
        title: `Conversion HEIC en cours`,
        description: `${heicFiles.length} HEIC file(s) will be converted to JPEG.`,
        variant: "evento",
        duration: Infinity,
      });
    }

    const processedFiles = await Promise.all(
      fileArray.map(async (file) => {
        if (file.name.toLowerCase().endsWith(".heic")) {
          try {
            const jpeg = await convertHEICtoJPEG(file);
            toast({ title: "HEIC converted", description: file.name });
            return jpeg;
          } catch (err) {
            console.error(err);
            toast({
              title: "Conversion failed",
              description: file.name,
              className: "bg-red-500 text-white",
            });
            return null;
          }
        }
        return file;
      }),
    );

    const valid = processedFiles.filter((f): f is File => !!f);
    const previews: MediaItem[] = valid.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
    }));

    setTempMediaPreviews((prev) => [...prev, ...previews]);
    useCreateEventStore.setState((state) => ({
      tempMediaPreview: [...(state.tempMediaPreview || []), ...previews],
    }));
  };

  const isUploadingComplete = () =>
    !uploadingMediaStatus.some(Boolean) && tempMediaPreviews.length === 0;

  return {
    tempMediaPreviews,
    uploadingMediaStatus,
    handleFileSelect,
    deleteMedia,
    isUploadingComplete,
    uploadMedia,
    cleanupInvalidTemp,
  };
};
