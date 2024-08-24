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
import { handleFieldChange } from "../eventActions";

const EventModeSelect = () => {
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
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="virtual">Virtual</SelectItem>
                <SelectItem value="in-person">In-Person</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default EventModeSelect;
