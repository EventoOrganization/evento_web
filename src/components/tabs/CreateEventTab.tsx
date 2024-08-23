import {
  RadioGroup,
  Radio,
  DatePicker,
  TimeInput,
  Modal,
  ModalContent,
  ModalBody,
  Textarea,
  Avatar,
  Button,
  Input,
  Image,
} from "@nextui-org/react";
import Link from "next/link";
import React, { useState } from "react";
import CameraIcon from "../icons/CameraIcon";
import ClockCircleLinearIcon from "../icons/ClockCircleLinearIcon";
import PlusAddUserIcon from "../icons/PlusAddUserIcon";
import VideoIcon from "../icons/VideoIcon";
import Tags from "../models/Tags";
import AddGuestsTab from "./AddGuestsTab";

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
      <div>
        <div className="my-3">
          <RadioGroup orientation="horizontal" className="text-md">
            <Radio value="public">Public</Radio>
            <Radio value="private">Private</Radio>
          </RadioGroup>
        </div>
        <div className="my-3">
          <h3 className="text-md font-bold mb-1">
            Upload Video{" "}
            <span className="text-gray-400 text-xs">(Optional)</span>
          </h3>
          <label
            htmlFor="product_video"
            className="flex flex-col items-center justify-center rounded-lg h-64 w-100 px-6 text-lg focus:outline-none focus:ring focus:border-blue-300 cursor-pointer bg-white"
          >
            <VideoIcon />
            <span className="mt-2 text-base leading-normal text-blue-500 font-bold">
              Upload Video
            </span>
            <Input type="file" id="product_video" className="hidden" />
          </label>
        </div>
        <div className="my-3">
          <h3 className="text-md font-bold mb-1">Images</h3>
          <div className="flex overflow-x-auto space-x-8 w-full">
            <section className="flex-shrink-0">
              <label
                htmlFor="product_image"
                className="flex flex-col items-center justify-center rounded-lg h-24 w-32 px-6 text-lg focus:outline-none focus:ring focus:border-blue-300 cursor-pointer bg-white"
              >
                <CameraIcon />
                <Input type="file" id="product_image" className="hidden" />
              </label>
            </section>
            <section className="flex-shrink-0">
              <Image
                alt="User one"
                src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
                radius="lg"
                className="w-auto h-24"
              />
            </section>
            <section className="flex-shrink-0">
              <Image
                alt="User one"
                src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
                radius="lg"
                className="w-auto h-24"
              />
            </section>
          </div>
        </div>
        <div className="my-3">
          <h3 className="text-md font-bold mb-1">Event name</h3>
          <Input key="outside" type="text" placeholder="Enter" size="lg" />
        </div>
        <div className="my-3">
          <RadioGroup orientation="horizontal" className="text-md">
            <Radio value="virtual">Virtual</Radio>
            <Radio value="inPerson">In person</Radio>
          </RadioGroup>
        </div>
        <div className="my-3">
          <h3 className="text-md font-bold mb-1">Location</h3>
          <Input key="outside" type="text" placeholder="Enter" size="lg" />
        </div>
        <div className="my-3">
          <h3 className="text-md font-bold mb-1">Date</h3>
          <DatePicker size="lg" />
        </div>
        <div className="my-3">
          <h3 className="text-md font-bold mb-1">Start Time</h3>
          <TimeInput size="lg" endContent={<ClockCircleLinearIcon />} />
        </div>
        <div className="my-3">
          <h3 className="text-md font-bold mb-1">End Time</h3>
          <TimeInput size="lg" endContent={<ClockCircleLinearIcon />} />
        </div>
        <div className="my-3">
          <h3 className="text-md font-bold mb-1">Tags</h3>
          <Input
            key="outside"
            type="text"
            placeholder="Enter"
            size="lg"
            onClick={() => openModal("Tags")}
          />
          <div>
            {isOpen && (
              <Modal
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                size="full"
                scrollBehavior="inside"
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      {modalType === "Tags" && (
                        <>
                          {/* <ModalHeader className="flex flex-col gap-1 text-center">Interest List</ModalHeader> */}
                          <ModalBody>
                            <Tags />
                          </ModalBody>
                        </>
                      )}
                      {modalType === "AddGuests" && (
                        <>
                          <ModalBody>
                            <AddGuestsTab />
                          </ModalBody>
                        </>
                      )}
                    </>
                  )}
                </ModalContent>
              </Modal>
            )}
          </div>
        </div>
        <div className="my-3">
          <h3 className="text-md font-bold mb-1">URL Link</h3>
          <Input
            key="outside"
            type="text"
            placeholder="Enter URL Link"
            size="lg"
          />
        </div>
        <div className="my-3">
          <h3 className="text-md font-bold mb-1">Description</h3>
          <Textarea
            labelPlacement="outside"
            placeholder="Type"
            size="lg"
            classNames={{
              input: "resize-y min-h-[10em]",
            }}
          />
        </div>
        <div className="my-3">
          <h3 className="text-md font-bold mb-1">Include an event chat?</h3>
          <RadioGroup orientation="horizontal" className="text-md">
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
          </RadioGroup>
        </div>
        <div className="my-3">
          <h3 className="text-md font-bold mb-1">Create RSVP form?</h3>
          <RadioGroup orientation="horizontal" className="text-md">
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
          </RadioGroup>
        </div>
        <div className="my-3">
          <h1 className="text-xl font-bold mb-1 text-fuchsia-700">
            Add Co-Host (optional)
          </h1>
          <div className="flex overflow-x-auto space-x-8 w-full">
            <section className="flex-shrink-0">
              <div className="flex flex-col items-center justify-center space-y-2">
                <Avatar
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  alt="Jully Marker"
                  className="w-20 h-20"
                />
                <span className="text-sm font-bold text-center">
                  Jully Marker
                </span>
              </div>
            </section>
            <section className="flex-shrink-0">
              <div className="flex flex-col items-center justify-center space-y-2">
                <Avatar
                  src="https://i.pravatar.cc/150?u=a04258114e29026302d"
                  alt="Tommy"
                  className="w-20 h-20"
                />
                <span className="text-sm font-bold text-center">Tommy</span>
              </div>
            </section>
            <section className="flex-shrink-0">
              <div className="flex flex-col items-center justify-center space-y-2">
                <Link
                  className="ml-2"
                  onClick={() => openModal("AddGuests")}
                  href={""}
                >
                  <div className="w-20 h-20 flex items-center justify-center rounded-full border border-gray-900 font-bold">
                    <PlusAddUserIcon />
                  </div>
                </Link>
                <span className="text-sm font-bold text-center">
                  Add People
                </span>
              </div>
            </section>
          </div>
        </div>
        <div className="mt-10">
          <div className="flex justify-center">
            <Button
              radius="full"
              className="bg-gradient-to-tr from-pink-500 to-blue-500 text-white shadow-lg px-10 text-sm"
              size="lg"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
