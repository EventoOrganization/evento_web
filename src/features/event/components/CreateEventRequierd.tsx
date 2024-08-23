"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createEventSchema } from "@/lib/zod";
import { useEventStore } from "@/store/useEventStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import InterestSelector from "./InterestSelector";

const CreateEventRequired = ({ className }: { className?: string }) => {
  const [isFetching, setIsFetching] = useState(false);
  const eventStore = useEventStore();

  const form = useForm<z.infer<typeof createEventSchema>>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: eventStore.title,
      eventType: eventStore.eventType,
      name: eventStore.name,
      mode: eventStore.mode,
      date: eventStore.date,
      startTime: eventStore.startTime,
      endTime: eventStore.endTime,
      description: eventStore.description,
      interestId: eventStore.interestId,
    },
  });

  const setEventField = useEventStore((state) => state.setEventField);

  const onSubmit: SubmitHandler<z.infer<typeof createEventSchema>> = async (
    data,
  ) => {
    console.log("data", data);
    setIsFetching(true);
    // Logique pour soumettre les données
    setIsFetching(false);
  };

  const handleFieldChange = (key: string, value: any) => {
    setEventField(key, value);
  };

  return (
    <FormProvider {...form}>
      <div
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-xl mx-auto bg-muted shadow border p-4 rounded-lg"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title*</FormLabel>
              <FormControl>
                <Input
                  placeholder="Event Title"
                  {...field}
                  value={eventStore.title} // Set the value from the store
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
          control={form.control}
          name="eventType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Type*</FormLabel>
              <FormControl>
                <select
                  {...field}
                  value={eventStore.eventType} // Set the value from the store
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
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name*</FormLabel>
              <FormControl>
                <Input
                  placeholder="Organizer Name"
                  {...field}
                  value={eventStore.name} // Set the value from the store
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
          control={form.control}
          name="mode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mode*</FormLabel>
              <FormControl>
                <select
                  {...field}
                  value={eventStore.mode} // Set the value from the store
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
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date*</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={eventStore.date} // Set the value from the store
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
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time*</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  value={eventStore.startTime} // Set the value from the store
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
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Time*</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  value={eventStore.endTime} // Set the value from the store
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
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description*</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Event Description"
                  {...field}
                  value={eventStore.description} // Set the value from the store
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
          control={form.control}
          name="interestId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interests*</FormLabel>
              <FormControl>
                <InterestSelector />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </FormProvider>
  );
};

export default CreateEventRequired;
