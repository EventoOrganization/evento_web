"use client";

import { cn } from "@/lib/utils";
import { createEventSchema } from "@/lib/zod";
import { useEventStore } from "@/store/useEventStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import CreateEventRequired from "./CreateEventRequierd";

const EventForm = ({ className }: { className?: string }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [step, setStep] = useState(1);
  const form = useForm<z.infer<typeof createEventSchema>>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      eventType: "public",
      name: "",
      date: "",
      startTime: "",
      endTime: "",
      description: "",
      mode: "virtual",
      includeChat: false,
      createRSVP: false,
    },
  });
  const setEventField = useEventStore((state) => state.setEventField);
  const clearEventForm = useEventStore((state) => state.clearEventForm);
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  const onSubmit: SubmitHandler<z.infer<typeof createEventSchema>> = async (
    data,
  ) => {
    console.log("data", data);
    setIsFetching(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await fetch(
        `http://localhost:8747/users/createEventAndRSVPform`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Utilisation du token pour l'authentification
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      const result = await response.json();
      console.log("Event created successfully:", result);

      clearEventForm();
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setIsFetching(false);
    }
  };
  const handleFieldChange = (key: string, value: any) => {
    setEventField(key, value);
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
        {step === 1 && (
          <>
            <CreateEventRequired />
          </>
        )}
        {step === 2 && (
          <>
            <Button onClick={prevStep}>Back</Button>
            <Button onClick={nextStep}>Next</Button>
          </>
        )}

        <Button
          type="submit"
          className="bg-evento-gradient-button rounded-full text-xs self-center px-8 mt-10 text-white"
          isLoading={isFetching}
        >
          Create Event
        </Button>
      </form>
    </FormProvider>
  );
};

export default EventForm;
