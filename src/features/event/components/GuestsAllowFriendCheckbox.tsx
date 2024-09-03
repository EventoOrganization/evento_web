import { Button } from "@/components/ui/button"; // Import the Button component
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/store/useEventStore";

const GuestsAllowFriendButton = () => {
  const eventStore = useEventStore();

  const handleButtonClick = () => {
    const newValue = !eventStore.guestsAllowFriend;
    eventStore.setEventField("guestsAllowFriend", newValue);
  };

  return (
    <FormField
      name="guestsAllowFriend"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="mr-2">Allow Guests to Invite Friends</FormLabel>
          <FormControl>
            <Button
              {...field}
              type="button"
              variant={"outline"}
              onClick={handleButtonClick}
              className={cn(
                "m-0",
                eventStore.guestsAllowFriend
                  ? "bg-evento-gradient-button text-white hover:text-white"
                  : "bg-gray-200 text-black",
              )}
            >
              {eventStore.guestsAllowFriend ? "Enabled" : "Disabled"}
            </Button>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default GuestsAllowFriendButton;
