import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCreateEventStore } from "@/store/useCreateEventStore";
import { useFormContext } from "react-hook-form";
import { handleFieldChange } from "../eventActions";

const EventTitleInput = ({ className }: { className?: string }) => {
  const eventStore = useCreateEventStore();
  const { register } = useFormContext();

  return (
    <FormField
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="sr-only">Title</FormLabel>
          <FormControl>
            <Input
              placeholder="Event Title"
              {...field}
              {...register("title")} // Connexion au form context
              value={eventStore.title}
              className={cn("", className)}
              onChange={(e) => {
                field.onChange(e);
                handleFieldChange("title", e.target.value);
              }}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default EventTitleInput;
