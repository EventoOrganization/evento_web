import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/store/useEventStore";
import { useFormContext } from "react-hook-form";
import { handleFieldChange } from "../eventActions";

const EventNameInput = ({ className }: { className?: string }) => {
  const eventStore = useEventStore();
  // const { user } = useSession();
  // useEffect(() => {
  //   if (user) {
  //     handleFieldChange("name", user.name);
  //   }
  // });
  const { register } = useFormContext();

  return (
    <FormField
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="sr-only">Name</FormLabel>
          <FormControl>
            <Input
              placeholder="Name"
              {...field}
              {...register("username")}
              value={eventStore.username}
              className={cn("", className)}
              onChange={(e) => {
                field.onChange(e);
                handleFieldChange("username", e.target.value);
              }}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default EventNameInput;
