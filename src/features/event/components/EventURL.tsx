"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="flex flex-col  gap-2">
      <div className="flex items-center gap-2">
        <Switch onClick={handleButtonClick} checked={isToggleOn} />{" "}
        <Label>Add URL</Label>
      </div>
      {isToggleOn && (
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={eventStore.UrlTitle || ""}
            onChange={(e) => handleUrlTitleChange(e.target.value)}
            placeholder="URL Title"
            className="w-full"
          />
          <Input
            type="url"
            value={eventStore.UrlLink || ""}
            onChange={(e) => handleUrlLinkChange(e.target.value)}
            placeholder="URL Link"
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default EventURL;
