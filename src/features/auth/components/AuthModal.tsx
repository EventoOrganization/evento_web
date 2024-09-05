"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import ForgotForm from "./forgot-form";
import LoginForm from "./LoginForm";
import OTPVerifyForm from "./OTPVerifyForm";
import ResetPasswordForm from "./resest-password-form";
import SignUpForm from "./SignupForm";

const AuthModal = ({
  onAuthSuccess,
  onClose,
}: {
  onAuthSuccess: () => void;
  onClose: () => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [currentForm, setCurrentForm] = useState<
    "login" | "signup" | "forgot-password" | "reset-password" | "verify"
  >("login");

  const handleAuthSuccess = () => {
    console.log("Auth success in AuthModal, closing modal");
    setIsModalOpen(false);
    onAuthSuccess();
  };

  const switchForm = (
    form: "login" | "signup" | "forgot-password" | "reset-password" | "verify",
  ) => {
    console.log("Switching to", form);
    setCurrentForm(form);
  };

  const renderForm = () => {
    switch (currentForm) {
      case "signup":
        return (
          <SignUpForm
            onAuthSuccess={() => switchForm("verify")}
            onSignInClick={() => switchForm("login")}
          />
        );
      case "login":
        return (
          <LoginForm
            onAuthSuccess={handleAuthSuccess}
            shouldRedirect={false}
            onSignUpClick={() => switchForm("signup")}
            onForgotPasswordClick={() => switchForm("forgot-password")}
          />
        );
      case "forgot-password":
        return (
          <ForgotForm
            onResetPasswordClick={() => switchForm("reset-password")}
            onBackToSignIn={() => switchForm("login")}
          />
        );
      case "reset-password":
        return <ResetPasswordForm onBackToSignIn={() => switchForm("login")} />;
      case "verify":
        return <OTPVerifyForm onBackToSignIn={() => switchForm("login")} />;
      default:
        return null;
    }
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
      <DialogContent className="rounded-xl">
        <DialogHeader>
          <DialogTitle>
            {currentForm === "signup"
              ? "Sign Up"
              : currentForm === "forgot-password"
                ? "Forgot Password"
                : currentForm === "reset-password"
                  ? "Reset Password"
                  : currentForm === "verify"
                    ? "Verify Code"
                    : "Sign In"}{" "}
            to Continue
          </DialogTitle>
        </DialogHeader>
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
