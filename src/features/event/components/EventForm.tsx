"use client";

import { Button } from "@/components/ui/button";
import apiService from "@/lib/apiService";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useEventStore } from "@/store/useEventStore";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import EventDateInput from "./EventDateInput";
import EventDescriptionArea from "./EventDescriptionArea";
import EventImageUpload from "./EventImageUpload";
import EventInterestSelect from "./EventInterestSelect";
import EventModeSelect from "./EventModeSelect";
import EventNameInput from "./EventNameInput";
import EventTitleInput from "./EventTitleInput";
import EventTypeSelect from "./EventTypeSelect";
import EventVideoUpload from "./EventVideoUpload";
import OpenStreetMapGeocoding from "./OpenStreetMapGeocoding";
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
      endDate: eventStore.endDate ? eventStore.endDate : eventStore.date || "",
      startTime: eventStore.startTime || "",
      endTime: eventStore.endTime || "",
      description: eventStore.description || "",
      mode: eventStore.mode || "virtual",
      interestId: eventStore.interestId || [],
      location: eventStore.location || "",
      latitude: eventStore.latitude || "",
      longitude: eventStore.longitude || "",
      timeSlots: eventStore.timeSlots || [],
    });
  }, [eventStore, reset]);
};

const EventForm = ({ className }: { className?: string }) => {
  const [isFetching, setIsFetching] = useState(false);
  const eventStore = useEventStore();
  const user = useAuthStore((state) => state.user);
  const token = apiService.fetchToken();
  const form = useForm({
    defaultValues: {
      title: eventStore.title || "",
      eventType: eventStore.eventType || "public",
      name: eventStore.name || user?.name,
      date: eventStore.date || "",
      endDate: eventStore.endDate ? eventStore.endDate : eventStore.date || "",
      startTime: eventStore.startTime || "",
      endTime: eventStore.endTime || "",
      description: eventStore.description || "",
      mode: eventStore.mode || "virtual",
      interestId: eventStore.interestId || [],
      location: eventStore.location || "",
      latitude: eventStore.latitude || "",
      longitude: eventStore.longitude || "",
      timeSlots: eventStore.timeSlots || [],
      images: [] as File[],
      video: "",
    },
  });
  console.log("Form default values:", form.formState.defaultValues);

  const onSubmit = async (data: any) => {
    console.log(isFetching);

    console.log("Initial form data:", data);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("name", data.name);
    formData.append("date", data.date);
    formData.append("endDate", data.endDate);
    formData.append("startTime", data.startTime);
    formData.append("endTime", data.endTime);
    formData.append("description", data.description);
    formData.append("mode", data.mode);
    formData.append("interestId", JSON.stringify(data.interestId));
    formData.append("location", data.location);
    formData.append("latitude", data.latitude);
    formData.append("longitude", data.longitude);
    formData.append("timeSlots", JSON.stringify(data.timeSlots));
    // Ajout des fichiers d'image au FormData
    data.images.forEach((image: File, index: number) => {
      formData.append(`images[${index}]`, image);
    });

    // Ajout de la vidéo au FormData
    if (data.video) {
      formData.append("video", data.video);
    }
    console.log("Form Data before submission:", Array.from(formData.entries()));

    setIsFetching(true);
    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/createEventAndRSVPform`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
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
          "space-y-4 max-w-xl mx-auto bg-muted shadow border p-4 rounded-lg mb-20",
          className,
        )}
      >
        <EventTitleInput />
        <EventNameInput />
        <div className="grid grid-cols-2 gap-4">
          <EventTypeSelect />
          <EventModeSelect />
        </div>
        <EventDateInput />
        {/* <EventLocationInput /> */}
        <OpenStreetMapGeocoding />
        <EventDescriptionArea />
        <EventInterestSelect />
        <EventImageUpload />
        <EventVideoUpload />
        {/* <FormField
          name="images"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    field.onChange(files);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        /> */}

        {/* <FormField
          name="video"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    field.onChange(files);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        /> */}

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
