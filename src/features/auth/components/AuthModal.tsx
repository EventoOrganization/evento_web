import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import SignInForm from "./sign-in-form";
import SignUpForm from "./sign-up-form";

const AuthModal = ({
  onAuthSuccess,
  onClose,
}: {
  onAuthSuccess: () => void;
  onClose: () => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuthSuccess = () => {
    console.log("Auth success in AuthModal, closing modal");
    setIsModalOpen(false);
    onAuthSuccess();
  };

  const toggleSignUp = () => {
    console.log(isSignUp ? "Switching to Sign In" : "Switching to Sign Up");
    setIsSignUp(!isSignUp);
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        console.log("Auth modal open state changed:", open);
        setIsModalOpen(open);
        if (!open) onClose();
      }}
    >
      <DialogContent className=" rounded-xl">
        <DialogHeader>
          <DialogTitle>
            {isSignUp ? "Sign Up" : "Sign In"} to Continue
          </DialogTitle>
        </DialogHeader>
        {isSignUp ? (
          <SignUpForm
            onAuthSuccess={handleAuthSuccess}
            onSignInClick={toggleSignUp}
            shouldRedirect={false}
          />
        ) : (
          <SignInForm
            onAuthSuccess={handleAuthSuccess}
            shouldRedirect={false}
            className=""
            onSignUpClick={toggleSignUp}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
