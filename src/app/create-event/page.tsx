"use client";
import { useState } from "react";
import SwipeableViews from "react-swipeable-views"; // Assurez-vous que le module est bien installé

import EventForm from "@/components/EventForm";
import EventPreview from "@/components/EventPreview";

const CreateEventPage = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <>
      <SwipeableViews
        className="md:hidden"
        index={activeIndex}
        onChangeIndex={(index: number) => setActiveIndex(index)}
      >
        <div>
          <EventPreview />
        </div>
        <div>
          <EventForm />
        </div>
      </SwipeableViews>
      <div className="hidden md:flex md:space-x-4">
        <div className="w-full md:w-2/3">
          <EventPreview />
        </div>
        <div className="w-full md:w-1/3">
          <EventForm />
        </div>
      </div>
    </>
  );
};

export default CreateEventPage;
