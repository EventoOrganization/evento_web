"use client";
import { Switch } from "@/components/ui/togglerbtn";
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
    <div className="flex items-center gap-2">
      <Switch checked={checked} onClick={handleButtonClick} />
      <h6 className="">Add Chat</h6>
    </div>
  );
};

export default EnableChatButton;
