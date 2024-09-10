"use client";
import { useEventStore } from "@/store/useEventStore";
import { useEffect } from "react";

const Page = () => {
  const eventStore = useEventStore();
  const localMedia = (eventStore.mediaPreviews || [])
    .filter(
      (media: any) =>
        typeof media === "object" &&
        "url" in media &&
        media.url.startsWith("/uploads"),
    )
    .map((media: any) => ({
      url: media.url,
      type: media.type,
    }));
  useEffect(() => {
    const clearEventFormData = async () => {
      await fetch("/api/cleanupTempFiles", {
        method: "POST",
        body: JSON.stringify(localMedia),
        headers: {
          "Content-Type": "application/json",
        },
      });
    };

    clearEventFormData();
  }, []);
  return <div>page</div>;
};

export default Page;
2;
