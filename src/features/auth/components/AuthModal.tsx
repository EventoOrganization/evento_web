import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import SignInForm from "./sign-in-form";
import SignUpForm from "./sign-up-form";

const AuthModal = ({ onAuthSuccess }: { onAuthSuccess: () => void }) => {
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
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isSignUp ? "Sign Up" : "Sign In"} to Continue
          </DialogTitle>
        </DialogHeader>
        {isSignUp ? (
          <SignUpForm onAuthSuccess={handleAuthSuccess} />
        ) : (
          <SignInForm
            onAuthSuccess={handleAuthSuccess}
            shouldRedirect={false}
          />
        )}
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            className="bg-blue-500 text-white rounded-full"
            onClick={toggleSignUp}
          >
            {isSignUp ? "Switch to Sign In" : "Switch to Sign Up"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
