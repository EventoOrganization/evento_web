"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useEventStore } from "@/store/useEventStore";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import EventDateInput from "./EventDateInput";
import EventDescriptionArea from "./EventDescriptionArea";
import EventImageUpload from "./EventImageUpload";
import EventInterestSelect from "./EventInterestSelect";
import EventModeSelect from "./EventModeSelect";
import EventTitleInput from "./EventTitleInput";
import EventTypeSelect from "./EventTypeSelect";
import EventVideoUpload from "./EventVideoUpload";

const EventForm = ({ className }: { className?: string }) => {
  const [isFetching, setIsFetching] = useState(false);
  const eventStore = useEventStore();
  const user = useAuthStore((state) => state.user);
  const form = useForm({
    defaultValues: {
      title: eventStore.title || "",
      eventType: eventStore.eventType || "public",
      name: eventStore.name || "",
      date: eventStore.date || "",
      startTime: eventStore.startTime || "",
      endTime: eventStore.endTime || "",
      description: eventStore.description || "",
      mode: eventStore.mode || "virtual",
      interestId: eventStore.interestId || [],
      images: eventStore.images || null,
      video: eventStore.video || null,
    },
  });
  const clearEventForm = useEventStore((state) => state.clearEventForm);

  const onSubmit = async (data: any) => {
    data.interestId = JSON.stringify(data.interestId);
    console.log(isFetching);

    setIsFetching(true);
    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/createEventAndRSVPform`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const resultData = await result.json();
      console.log("resultData", resultData);

      clearEventForm();
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "space-y-4 max-w-xl mx-auto bg-muted shadow border p-4 rounded-lg",
          className,
        )}
      >
        <EventTitleInput />
        <div className="grid grid-cols-2 gap-4">
          <EventTypeSelect />
          <EventModeSelect />
        </div>
        <EventDateInput />
        <div className="grid grid-cols-2 gap-4">
          <EventVideoUpload />
          <EventImageUpload />
        </div>
        <EventDescriptionArea />
        <EventInterestSelect />
        <Button
          type="submit"
          className="bg-evento-gradient-button rounded-full text-xs self-center px-8 mt-20 text-white"
        >
          Create Event
        </Button>
      </form>
    </FormProvider>
  );
};

export default EventForm;
