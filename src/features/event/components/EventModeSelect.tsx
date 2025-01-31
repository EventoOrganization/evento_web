import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useCreateEventStore } from "@/store/useCreateEventStore";
import { useFormContext } from "react-hook-form";

const EventModeSelect = () => {
  const eventStore = useCreateEventStore();
  const { register, setValue } = useFormContext();

  // const capitalizeFirstLetter = (value: string) => {
  //   if (!value) return "";
  //   return value.charAt(0).toUpperCase() + value.slice(1);
  // };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setValue("mode", value);
  };

  return (
    <FormField
      name="mode"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="sr-only">Mode</FormLabel>
          <FormControl>
            <select
              className="form-select rounded px-3 py-2 w-full"
              {...register("mode")}
              value={eventStore.mode}
              onChange={(e) => {
                field.onChange(e);
                handleChange(e);
              }}
            >
              <option value="virtual">Virtual</option>
              <option value="in-person">In-Person</option>
              <option value="both">Both</option>
            </select>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default EventModeSelect;
