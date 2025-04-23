import AuthModal from "@/components/system/auth/AuthModal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useState } from "react";
import Event from "./Event";

const EventModalValidation = ({ onSubmit }: { onSubmit: () => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useSession();
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFinalSubmit = () => {
    if (user) {
      handleAuthSuccess();
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    onSubmit();
    closeModal();
  };

  return (
    <>
      <Button
        type="button"
        className="bg-evento-gradient-button rounded-full text-xs self-center px-8 mt-20 text-white"
        onClick={openModal}
      >
        Create Event
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Review and Confirm Your Event</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-80%">
            <Event />
          </ScrollArea>
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              className="bg-red-500 text-white rounded-full"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-green-500 text-white rounded-full ml-4"
              onClick={handleFinalSubmit}
            >
              Confirm Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {showAuthModal && (
        <AuthModal onAuthSuccess={handleAuthSuccess} onClose={closeModal} />
      )}
    </>
  );
};

export default EventModalValidation;
