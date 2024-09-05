"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import ForgotForm from "./forgot-form";
import ResetPasswordForm from "./resest-password-form";
import SignInForm from "./sign-in-form";
import SignUpForm from "./sign-up-form";
import VerifyCodeForm from "./verify-code-form";

const AuthModal = ({
  onAuthSuccess,
  onClose,
}: {
  onAuthSuccess: () => void;
  onClose: () => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [currentForm, setCurrentForm] = useState<
    | "signin"
    | "signup"
    | "forgot-password"
    | "reset-password"
    | "verify-reset-code"
  >("signin");

  const handleAuthSuccess = () => {
    console.log("Auth success in AuthModal, closing modal");
    setIsModalOpen(false);
    onAuthSuccess();
  };

  const switchForm = (
    form:
      | "signin"
      | "signup"
      | "forgot-password"
      | "reset-password"
      | "verify-reset-code",
  ) => {
    console.log("Switching to", form);
    setCurrentForm(form);
  };

  const renderForm = () => {
    switch (currentForm) {
      case "signup":
        return (
          <SignUpForm
            onAuthSuccess={handleAuthSuccess}
            onSignInClick={() => switchForm("signin")}
            shouldRedirect={false}
          />
        );
      case "signin":
        return (
          <SignInForm
            onAuthSuccess={handleAuthSuccess}
            shouldRedirect={false}
            className=""
            onSignUpClick={() => switchForm("signup")}
            onForgotPasswordClick={() => switchForm("forgot-password")}
          />
        );
      case "forgot-password":
        return (
          <ForgotForm
            onResetPasswordClick={() => switchForm("reset-password")}
            onBackToSignIn={() => switchForm("signin")}
          />
        );
      case "reset-password":
        return (
          <ResetPasswordForm onBackToSignIn={() => switchForm("signin")} />
        );
      case "verify-reset-code":
        return <VerifyCodeForm onBackToSignIn={() => switchForm("signin")} />;
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
                  : currentForm === "verify-reset-code"
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
