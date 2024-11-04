"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/store/useEventStore";
import { useState } from "react";
import { handleFieldChange } from "../eventActions";

const EventURL = () => {
  const eventStore = useEventStore();
  const [isEditing, setIsEditing] = useState(!!eventStore.URL);

  const handleButtonClick = () => {
    setIsEditing((prevState) => !prevState);
  };

  const handleURLChange = (value: string) => {
    const formattedURL =
      value.startsWith("http://") || value.startsWith("https://")
        ? value
        : `https://${value}`;

    handleFieldChange("URL", formattedURL);
  };

  return (
    <div>
      {!isEditing ? (
        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          className={cn(
            "transition-colors",
            isEditing && "bg-evento-gradient text-white",
          )}
        >
          {isEditing ? "Edit URL" : "Add URL"}
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <Input
            type="url"
            value={eventStore.URL || ""}
            onChange={(e) => handleURLChange(e.target.value)}
            placeholder="Enter your URL"
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default EventURL;
