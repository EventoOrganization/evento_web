"use client";
import React, { useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import CreateEventTab from "@/components/tabs/CreateEventTab";
import RsvpFormTab from "@/components/tabs/RsvpFormTab";
import AddGuestsTab from "@/components/tabs/AddGuestsTab";

export default function CreateEvent() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const openModal = (type: any) => {
    setModalType(type);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalType(null);
  };
  return (
    <>
      <div className="min-h-screen bg-slate-100">
        <div className="text-center font-bold p-3">
          <h1 className="text-xl">Create Event</h1>
        </div>
        <div className="flex w-full flex-col">
          <Tabs
            aria-label="Options"
            variant="underlined"
            color="primary"
            className="font-bold mb-5"
          >
            <Tab key="createEvent" title="Create Event">
              <div className="mx-3">
                <CreateEventTab />
              </div>
            </Tab>
            <Tab key="rsvpForm" title="RSVP Form">
              <div className="mx-3">
                <RsvpFormTab />
              </div>
            </Tab>
            <Tab key="addGuest" title="Add Guests">
              <div className="mx-3">
                <AddGuestsTab />
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </>
  );
}
