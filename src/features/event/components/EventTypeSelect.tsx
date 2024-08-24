import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEventStore } from "@/store/useEventStore";
import { useFormContext } from "react-hook-form";
import { handleFieldChange } from "../eventActions";

const EventTypeSelect = () => {
  const eventStore = useEventStore();
  const { register } = useFormContext();

  return (
    <FormItem>
      <FormLabel className="sr-only">Event Type</FormLabel>
      <FormControl>
        <Select
          onValueChange={(value) => {
            handleFieldChange("eventType", value);
          }}
          {...register("eventType")}
        >
          <SelectTrigger className="">
            <SelectValue placeholder={eventStore.eventType || "Event Type"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="private">Private</SelectItem>
          </SelectContent>
        </Select>
      </FormControl>
    </FormItem>
  );
};

export default EventTypeSelect;
