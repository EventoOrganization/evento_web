import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
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

const EventModeSelect = () => {
  const eventStore = useEventStore();
  const { register } = useFormContext();

  const capitalizeFirstLetter = (value: string) => {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <FormField
      name="mode"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="sr-only">Mode</FormLabel>
          <FormControl>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                handleFieldChange("mode", value);
              }}
              {...register("mode")}
            >
              <SelectTrigger className="">
                <SelectValue
                  placeholder={
                    capitalizeFirstLetter(eventStore.mode) || "Select Mode"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="virtual">Virtual</SelectItem>
                <SelectItem value="in-person">In-Person</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default EventModeSelect;
