"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useEventStore } from "@/store/useEventStore";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import EventDateInput from "./EventDateInput";
import EventDescriptionArea from "./EventDescriptionArea";
import EventImageUpload from "./EventImageUpload";
import EventInterestSelect from "./EventInterestSelect";
import EventLocationInput from "./EventLocationInput";
import EventModeSelect from "./EventModeSelect";
import EventNameInput from "./EventNameInput";
import EventTitleInput from "./EventTitleInput";
import EventTypeSelect from "./EventTypeSelect";
import EventVideoUpload from "./EventVideoUpload";

const useSyncFormWithStore = () => {
  const { reset } = useFormContext();
  const eventStore = useEventStore();
  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    reset({
      title: eventStore.title || "",
      eventType: eventStore.eventType || "public",
      name: eventStore.name || user?.name,
      date: eventStore.date || "",
      startTime: eventStore.startTime || "",
      endTime: eventStore.endTime || "",
      description: eventStore.description || "",
      mode: eventStore.mode || "virtual",
      interestId: eventStore.interestId || [],
      location: eventStore.location || "",
      latitude: eventStore.latitude || "",
      longitude: eventStore.longitude || "",
      images: [],
      video: "",
    });
  }, [eventStore, reset]);
};

const EventForm = ({ className }: { className?: string }) => {
  const [isFetching, setIsFetching] = useState(false);
  const eventStore = useEventStore();
  const user = useAuthStore((state) => state.user);
  const form = useForm({
    defaultValues: {
      title: eventStore.title || "",
      eventType: eventStore.eventType || "public",
      name: eventStore.name || user?.name,
      date: eventStore.date || "",
      startTime: eventStore.startTime || "",
      endTime: eventStore.endTime || "",
      description: eventStore.description || "",
      mode: eventStore.mode || "virtual",
      interestId: eventStore.interestId || [],
      location: eventStore.location || "",
      latitude: eventStore.latitude || "",
      longitude: eventStore.longitude || "",
      images: [],
      video: "",
    },
  });

  const onSubmit = async (data: any) => {
    data.interestId = JSON.stringify(data.interestId);
    console.log(isFetching);
    console.log("data", data);

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

      // clearEventForm();
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <FormProvider {...form}>
      {" "}
      <SyncFormWithStore />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "space-y-4 max-w-xl mx-auto bg-muted shadow border p-4 rounded-lg",
          className,
        )}
      >
        <EventTitleInput />
        {form.formState.defaultValues?.name ? null : <EventNameInput />}
        <div className="grid grid-cols-2 gap-4">
          <EventTypeSelect />
          <EventModeSelect />
        </div>
        <EventDateInput />
        <EventLocationInput />
        <EventVideoUpload />
        <EventImageUpload />
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
const SyncFormWithStore = () => {
  useSyncFormWithStore(); // Custom hook call inside a component that will be called after FormProvider is ready
  return null; // This component does not render anything
};
export default EventForm;
