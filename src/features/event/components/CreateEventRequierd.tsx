"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/store/useEventStore";
import { useFormContext } from "react-hook-form";
import InterestSelector from "./InterestSelector";

const CreateEventRequired = ({ className }: { className?: string }) => {
  const eventStore = useEventStore();
  const { register } = useFormContext(); // Utilisation du contexte form

  const setEventField = useEventStore((state) => state.setEventField);

  const handleFieldChange = (key: string, value: any) => {
    setEventField(key, value);
  };

  return (
    <div
      className={cn(
        "space-y-4 max-w-xl mx-auto bg-muted shadow border p-4 rounded-lg",
        className,
      )}
    >
      <FormField
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title*</FormLabel>
            <FormControl>
              <Input
                placeholder="Event Title"
                {...field}
                {...register("title")} // Connexion au form context
                value={eventStore.title}
                className="rounded-xl bg-muted sm:bg-background"
                onChange={(e) => {
                  field.onChange(e);
                  handleFieldChange("title", e.target.value);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        name="eventType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Type*</FormLabel>
            <FormControl>
              <select
                {...field}
                {...register("eventType")} // Connexion au form context
                value={eventStore.eventType}
                className="rounded-xl bg-muted"
                onChange={(e) => {
                  field.onChange(e);
                  handleFieldChange("eventType", e.target.value);
                }}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name*</FormLabel>
            <FormControl>
              <Input
                placeholder="Organizer Name"
                {...field}
                {...register("name")} // Connexion au form context
                value={eventStore.name}
                className="rounded-xl bg-muted sm:bg-background"
                onChange={(e) => {
                  field.onChange(e);
                  handleFieldChange("name", e.target.value);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        name="mode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mode*</FormLabel>
            <FormControl>
              <select
                {...field}
                {...register("mode")} // Connexion au form context
                value={eventStore.mode}
                className="rounded-xl bg-muted"
                onChange={(e) => {
                  field.onChange(e);
                  handleFieldChange("mode", e.target.value);
                }}
              >
                <option value="virtual">Virtual</option>
                <option value="in-person">In-Person</option>
              </select>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date*</FormLabel>
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
      <FormField
        name="startTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start Time*</FormLabel>
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
            <FormLabel>End Time*</FormLabel>
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
      <FormField
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description*</FormLabel>
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
      <FormField
        name="interestId"
        render={({}) => (
          <FormItem>
            <FormLabel>Interests*</FormLabel>
            <FormControl>
              <InterestSelector />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default CreateEventRequired;
