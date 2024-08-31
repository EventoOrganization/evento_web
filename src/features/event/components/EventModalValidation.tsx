import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import AuthModal from "@/features/auth/components/AuthModal"; // Importez AuthModal
import { isUserLoggedInCSR } from "@/features/event/eventActions";
import { useState } from "react";
import Event from "./Event";

const EventModalValidation = ({ onSubmit }: { onSubmit: () => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const openModal = () => {
    console.log("Opening validation modal");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log("Closing validation modal");
    setIsModalOpen(false);
  };

  const handleFinalSubmit = () => {
    console.log("Handle final submit clicked");
    if (isUserLoggedInCSR()) {
      console.log("User is logged in");
      handleAuthSuccess();
    } else {
      console.log("User is not logged in, opening auth modal");
      setShowAuthModal(true); // Afficher AuthModal si l'utilisateur n'est pas connecté
    }
  };

  const handleAuthSuccess = () => {
    console.log("Auth successful, closing auth modal");
    setShowAuthModal(false); // Fermez AuthModal après une connexion/inscription réussie
    console.log("Submitting event and closing validation modal");
    onSubmit(); // Continuez avec la soumission de l'événement après une connexion réussie
    closeModal(); // Fermez la modal de validation de l'événement
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
