import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useEventStore } from "@/store/useEventStore";

const GuestsAllowFriendCheckbox = () => {
  const eventStore = useEventStore();

  const handleCheckboxChange = (checked: boolean) => {
    eventStore.setEventField("guestsAllowFriend", checked);
  };

  return (
    <FormField
      name="guestsAllowFriend"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Allow Guests to Invite Friends</FormLabel>
          <FormControl>
            <Checkbox
              {...field}
              checked={eventStore.guestsAllowFriend || false}
              onCheckedChange={handleCheckboxChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default GuestsAllowFriendCheckbox;
