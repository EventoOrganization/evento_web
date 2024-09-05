import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { useEventStore } from "@/store/useEventStore";
import { useFormContext } from "react-hook-form";
import { handleFieldChange } from "../eventActions";

const EventTypeSelect = () => {
  const eventStore = useEventStore();
  const { register, setValue } = useFormContext();

  // const capitalizeFirstLetter = (value: string) => {
  //   if (!value) return "";
  //   return value.charAt(0).toUpperCase() + value.slice(1);
  // };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    handleFieldChange("eventType", value);
    setValue("eventType", value);
  };

  return (
    <FormItem>
      <FormLabel className="sr-only">Event Type</FormLabel>
      <FormControl>
        <select
          className="form-select rounded px-3 py-2 w-full"
          {...register("eventType")}
          value={eventStore.eventType}
          onChange={handleChange}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </FormControl>
    </FormItem>
  );
};

export default EventTypeSelect;
