"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/store/useEventStore";
import { useEffect, useState } from "react";
import { handleFieldChange } from "../eventActions";
const EnableChatButton = () => {
  const eventStore = useEventStore();
  const [checked, setChecked] = useState(eventStore.includeChat || false);
  useEffect(() => {
    setChecked(eventStore.includeChat);
  }, [eventStore.includeChat]);
  const handleButtonClick = () => {
    setChecked((prevState) => {
      const newState = !prevState;
      handleFieldChange("includeChat", newState);
      eventStore.setEventField("includeChat", newState); // Update the store value
      return newState;
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleButtonClick}
      className={cn(
        "transition-colors",
        checked && "bg-evento-gradient text-white",
      )}
    >
      {checked ? "Chat Enabled" : "Enable Chat"}
    </Button>
  );
};

export default EnableChatButton;
