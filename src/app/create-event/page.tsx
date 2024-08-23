"use client";
import Section from "@/components/layout/Section";
import EventForm from "@/features/event/components/EventForm";
import EventPreview from "@/features/event/components/EventPreview";
import { useState } from "react";
import SwipeableViews from "react-swipeable-views";

const CreateEventPage = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <Section className="md:mt-24 py-4 max-w-5xl">
      <SwipeableViews
        className="md:hidden w-full"
        index={activeIndex}
        onChangeIndex={(index: number) => setActiveIndex(index)}
      >
        <EventPreview classname="" />
        <EventForm className="" />
      </SwipeableViews>
      <div className="hidden md:flex md:space-x-4 w-full">
        <EventPreview classname="w-2/3 " />
        <EventForm className="w-1/3 " />
      </div>
    </Section>
  );
};

export default CreateEventPage;
