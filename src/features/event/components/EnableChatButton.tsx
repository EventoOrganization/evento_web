"use client";
import { Button } from "@/components/ui/button"; // Import the Button component
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { cn } from "@/lib/utils"; // Utility function for conditional classNames
import { useEventStore } from "@/store/useEventStore";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { handleFieldChange } from "../eventActions";
const EnableChatButton = () => {
  const { control } = useFormContext();
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
    <FormField
      control={control}
      name="includeChat"
      render={({}) => (
        <FormItem className="space-y-0">
          <FormLabel className="sr-only">Enable Chat</FormLabel>
          <FormControl>
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
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default EnableChatButton;
