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

  const capitalizeFirstLetter = (value: string) => {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

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
            <SelectValue
              className=""
              placeholder={
                capitalizeFirstLetter(eventStore.eventType) || "Select Type"
              }
            />
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
