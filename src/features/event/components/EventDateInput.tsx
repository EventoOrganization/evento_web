import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEventStore } from "@/store/useEventStore";
import { useFormContext } from "react-hook-form";
import { handleFieldChange } from "../eventActions";

const EventDateInput = () => {
  const eventStore = useEventStore();
  const { register } = useFormContext();
  return (
    <>
      {" "}
      <FormField
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date</FormLabel>
            <FormControl>
              <Input
                type="date"
                {...field}
                {...register("date")} // Connexion au form context
                value={eventStore.date}
                className="rounded-xl bg-muted sm:bg-background"
                onChange={(e) => {
                  field.onChange(e);
                  handleFieldChange("date", e.target.value);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  {...register("startTime")} // Connexion au form context
                  value={eventStore.startTime}
                  className="rounded-xl bg-muted sm:bg-background"
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange("startTime", e.target.value);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Time</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  {...register("endTime")} // Connexion au form context
                  value={eventStore.endTime}
                  className="rounded-xl bg-muted sm:bg-background"
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange("endTime", e.target.value);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default EventDateInput;
