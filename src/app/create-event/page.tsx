"use client";
import Section from "@/components/layout/Section";
import Event from "@/features/event/components/Event";
import EventForm from "@/features/event/components/EventForm";
import { useState } from "react";
import SwipeableViews from "react-swipeable-views";

const CreateEventPage = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <Section className="md:mt-24 py-4 max-w-5xl w-full">
      <SwipeableViews
        className="md:hidden w-full"
        index={activeIndex}
        onChangeIndex={(index: number) => setActiveIndex(index)}
      >
        <EventForm className="" />
      </SwipeableViews>
      <div className="hidden md:flex md:space-x-4 w-full">
        <Event className="" />
        <EventForm className="min-w-96" />
      </div>
    </Section>
  );
};

export default CreateEventPage;
