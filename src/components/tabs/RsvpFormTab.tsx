import {
  Button,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
} from "@nextui-org/react";
import React, { useState } from "react";
import AddAnotherField from "../models/AddAnotherField";

export default function RsvpFormTab() {
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
      <div>Create your personalized RSVP form for your guests to fill in.</div>
      <div className="mt-5 font-bold text-xl text-fuchsia-700">RSVP Form</div>
      <div className="my-3">
        <h3 className="text-md font-bold mb-1">First Name*</h3>
        <Input key="outside" type="text" placeholder="Enter" size="lg" />
      </div>
      <div className="my-3">
        <h3 className="text-md font-bold mb-1">Last Name</h3>
        <Input key="outside" type="text" placeholder="Enter" size="lg" />
      </div>
      <div className="my-3">
        <h3 className="text-md font-bold mb-1">E-mail</h3>
        <Input key="outside" type="email" placeholder="Enter" size="lg" />
      </div>
      <div className="my-10 flex items-center">
        <Link
          className="text-dark"
          onClick={() => openModal("AddAnotherField")}
        >
          <div className="rounded-full bg-gradient-to-tr from-pink-500 to-blue-500 w-6 h-6 p-5 flex items-center justify-center text-white text-3xl font-bold mr-3">
            +
          </div>
          <div className="text-md font-bold">Add another field</div>
        </Link>
      </div>
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
                  {modalType === "AddAnotherField" && (
                    <>
                      <ModalBody>
                        <AddAnotherField />
                      </ModalBody>
                    </>
                  )}
                </>
              )}
            </ModalContent>
          </Modal>
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50 mx-10 mb-2 rounded-full md:rounded-full">
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
    </>
  );
}
