"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/togglerbtn";
import { useState } from "react";
const EventURL = ({
  onChange,
}: {
  onChange: (field: string, value: string) => void;
}) => {
  const [isToggleOn, setIsToggleOn] = useState(false);
  const [URLLink, setURLLink] = useState("");
  const [URLTitle, setURLTitle] = useState("");
  const handleButtonClick = () => {
    if (isToggleOn) {
      setIsToggleOn(false);
      onChange("UrlLink", "");
      onChange("UrlTitle", "");
    } else {
      setIsToggleOn(true);
      onChange("UrlLink", URLLink);
      onChange("UrlTitle", URLTitle);
    }
  };
  const handleUrlLinkChange = (value: string) => {
    const formattedURL =
      value.startsWith("http://") || value.startsWith("https://")
        ? value
        : `https://${value}`;
    setURLLink(formattedURL);
    onChange("UrlLink", formattedURL);
  };
  const handleUrlTitleChange = (value: string) => {
    setURLTitle(value);
    onChange("UrlTitle", value);
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
            value={URLTitle || ""}
            onChange={(e) => handleUrlTitleChange(e.target.value)}
            placeholder="URL Title"
            className="w-full"
          />
          <Input
            type="url"
            value={URLLink || ""}
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
