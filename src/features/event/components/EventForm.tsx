"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import apiService from "@/lib/apiService";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useEventStore } from "@/store/useEventStore";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import EventDateInput from "./EventDateInput";
import EventDescriptionArea from "./EventDescriptionArea";
import EventGuestsModal from "./EventGuestsModal";
import EventInterestSelect from "./EventInterestSelect";
import EventModeSelect from "./EventModeSelect";
import EventNameInput from "./EventNameInput";
import EventTitleInput from "./EventTitleInput";
import EventTypeSelect from "./EventTypeSelect";
import OpenStreetMapGeocoding from "./OpenStreetMapGeocoding";
const useSyncFormWithStore = () => {
  const { reset, getValues } = useFormContext();
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
      guests: eventStore.guests || [],
      images: getValues("images") || [], // Preserve current images
      video: getValues("video") || "", // Preserve current video
    });
  }, [eventStore, reset]);
};

const EventForm = ({ className }: { className?: string }) => {
  // const [isFetching, setIsFetching] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const eventStore = useEventStore();
  const user = useAuthStore((state) => state.user);

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
      guests: eventStore.guests || [],
      images: [] as File[],
      video: "",
    },
  });

  const onSubmit = async (data: any) => {
    // setIsFetching(true);

    try {
      const token = await apiService.fetchToken();
      console.log("Token:", token);
      console.log("Form Data:", form.getValues("images"));
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
      formData.append("guests", JSON.stringify(data.guests));
      const images = form.getValues("images");
      console.log("Images in form before submission:", images);
      if (data.images && data.images.length > 0) {
        data.images.forEach((image: File, index: number) => {
          formData.append(`images[${index}]`, image);
        });
      }
      if (data.video) {
        formData.append("video", data.video[0]);
      }
      // formData.append("eventType", data.eventType);
      // formData.append("questions", JSON.stringify(data.questions));
      // formData.append("additionalField", JSON.stringify(data.additionalField));
      // formData.append("coHosts", JSON.stringify(data.coHosts));
      // formData.append("privateEventLink", data.privateEventLink);
      // formData.append("guestsAllowFriend", data.guestsAllowFriend);
      // formData.append("includeChat", data.includeChat);
      console.log(
        "Form Data before submission:",
        Array.from(formData.entries()),
      );

      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/createEventAndRSVPfor`,
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
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      // setIsFetching(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log("Selected Images:", files);
    // Set images in form state
    form.setValue("images", files);

    // Immediately log to ensure images are set
    console.log("Images after setValue:", form.getValues("images"));
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(imageUrls);
    eventStore.setEventField("imagePreviews", imageUrls);
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

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
        {/* <EventImageUpload />
        <EventVideoUpload /> */}
        <FormField
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
                    handleImageChange(e);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
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
                    console.log("Selected Files:", files);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <EventGuestsModal />
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
