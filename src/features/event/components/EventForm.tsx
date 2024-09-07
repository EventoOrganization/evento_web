// src\features\event\components\EventForm.tsx
"use client";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/store/useEventStore";
import { UserType } from "@/types/UserType";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import EnableChatButton from "./EnableChatButton";
import EventCoHostsModal from "./EventCoHostsModal";
import EventDescriptionArea from "./EventDescriptionArea";
import EventGuestsModal from "./EventGuestsModal";
import EventLocationInput from "./EventLocationInput";

const useSyncFormWithStore = () => {
  const { reset, getValues } = useFormContext();
  const eventStore = useEventStore();
  const { user } = useSession();

  useEffect(() => {
    const currentValues = getValues();
    console.log("currentValues before reset", currentValues);
    reset({
      title: eventStore.title || "",
      eventType: eventStore.eventType || "public",
      name: eventStore.name || user?.name || "",
      date: eventStore.date || "",
      endDate: eventStore.endDate || eventStore.date || "",
      startTime: eventStore.startTime || "",
      endTime: eventStore.endTime || "",
      description: eventStore.description || "",
      mode: eventStore.mode || "virtual",
      location: eventStore.location || "",
      latitude: eventStore.latitude || "",
      longitude: eventStore.longitude || "",
      timeSlots: eventStore.timeSlots || [],
      guests: eventStore.guests || [],
      coHosts: eventStore.coHosts || [],
      guestsAllowFriend: eventStore.guestsAllowFriend || false,
      questions: eventStore.questions || [],
      additionalField: eventStore.additionalField || [],
      includeChat: eventStore.includeChat || false,
      images: currentValues.images,
      video: currentValues.video,
      media: currentValues.media,
    });
    console.log("currentValues after reset", getValues());
  }, [eventStore, reset, user]);
};

const EventForm = ({
  className,
  allUsers,
}: {
  className?: string;
  allUsers?: UserType[];
}) => {
  const router = useRouter();
  const eventStore = useEventStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingData, setPendingData] = useState(null); // Store pending form data
  const { user, token } = useSession();
  const form = useForm();

  const onSubmit = async (data: any) => {
    if (!user) {
      setPendingData(data); // Store form data temporarily
      setIsAuthModalOpen(true); // Open authentication modal
    } else {
      await handleFormSubmit(data); // Proceed with form submission
    }
  };
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const mediaUrls = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("image/") ? "image" : "video",
    }));

    console.log("Selected Media:", mediaUrls);

    eventStore.setEventField("mediaPreviews", mediaUrls);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value) || typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string); // Type assertion
        }
      });

      const media = data.media || [];
      media.forEach((file: File, index: number) => {
        formData.append(`media[${index}]`, file);
      });

      console.log(
        "Form Data before submission:",
        Array.from(formData.entries()),
      );

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
      eventStore.clearEventForm();
      router.push(`/events/${resultData.body._id}`);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleAuthSuccess = () => {
    if (pendingData) {
      handleFormSubmit(pendingData); // Submit form data after successful authentication
      setPendingData(null); // Clear pending data
    }
  };

  return (
    <>
      <div>
        <FormProvider {...form}>
          <SyncFormWithStore />
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn(
              "space-y-4 max-w-xl mx-auto bg-muted shadow border p-4 rounded-lg mb-20",
              className,
            )}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
          >
            {/* <EventTitleInput /> */}
            {/* <EventDateInput /> */}
            {/* <div className="grid grid-cols-2 gap-4">
              <EventTypeSelect />
              <EventModeSelect />
            </div> */}
            <FormField
              name="media"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media (Images or Videos)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        field.onChange(files);
                        handleMediaChange(e);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <EventLocationInput />
            <EventDescriptionArea />
            <h4 className="text-eventoPurpleLight">More Options</h4>
            <div className="flex flex-wrap gap-2">
              <EventGuestsModal allUsers={allUsers as UserType[]} />
              <EventCoHostsModal allUsers={allUsers as UserType[]} />
              <EnableChatButton />
            </div>
          </form>
        </FormProvider>
        <Button
          variant={"ghost"}
          type={"button"}
          className="bg-evento-gradient-button text-white"
          onClick={form.handleSubmit(onSubmit)}
        >
          Create Event!
        </Button>
      </div>
      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
};

export default EventForm;

const SyncFormWithStore = () => {
  useSyncFormWithStore();
  return null;
};
