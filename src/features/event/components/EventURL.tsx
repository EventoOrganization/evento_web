"use client";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/togglerbtn";
import { useEventStore } from "@/store/useEventStore";
import { useEffect, useState } from "react";
import { handleFieldChange } from "../eventActions";
const EventURL = () => {
  const eventStore = useEventStore();
  const { isUrl } = eventStore;
  const [isToggleOn, setIsToggleOn] = useState(isUrl || false);
  useEffect(() => {
    if (isUrl) {
      setIsToggleOn(true);
    }
  }, []);

  const handleButtonClick = () => {
    if (isToggleOn) {
      setIsToggleOn(false);
      handleFieldChange("UrlLink", "");
      handleFieldChange("UrlTitle", "");
    } else {
      setIsToggleOn(true);
      handleFieldChange("isUrl", true);
    }
  };
  const handleUrlLinkChange = (value: string) => {
    const formattedURL =
      value.startsWith("http://") || value.startsWith("https://")
        ? value
        : `https://${value}`;

    handleFieldChange("UrlLink", formattedURL);
  };
  const handleUrlTitleChange = (value: string) => {
    handleFieldChange("UrlTitle", value);
  };

  return (
    <>
      <Switch onClick={handleButtonClick} checked={isToggleOn} />
      {isToggleOn && (
        <div className="flex items-center gap-2">
          <Input
            type="url"
            value={eventStore.UrlLink || ""}
            onChange={(e) => handleUrlLinkChange(e.target.value)}
            placeholder="Enter your URL"
            className="w-full"
          />
          <Input
            type="url"
            value={eventStore.UrlTitle || ""}
            onChange={(e) => handleUrlTitleChange(e.target.value)}
            placeholder="Enter a custom title (optional)"
            className="w-full"
          />
        </div>
      )}
    </>
  );
};

export default EventURL;
