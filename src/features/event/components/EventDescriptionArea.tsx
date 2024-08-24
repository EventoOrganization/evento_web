import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useEventStore } from "@/store/useEventStore";
import { useFormContext } from "react-hook-form";
import { handleFieldChange } from "../eventActions";

const EventDescriptionArea = () => {
  const eventStore = useEventStore();
  const { register } = useFormContext();
  return (
    <FormField
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="sr-only">Description</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Event Description"
              {...field}
              {...register("description")} // Connexion au form context
              value={eventStore.description}
              className="rounded-xl bg-muted sm:bg-background"
              onChange={(e) => {
                field.onChange(e);
                handleFieldChange("description", e.target.value);
              }}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default EventDescriptionArea;
