"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchData, HttpMethod } from "@/utils/fetchData";
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
  onAuthSuccess: (token: string) => void;
  onClose: () => void;
}) => {
  const { setUser } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [currentForm, setCurrentForm] = useState<
    "login" | "signup" | "forgot-password" | "reset-password" | "verify"
  >("login");
  const handleVerifySuccess = () => {
    setIsModalOpen(false);
  };
  const handleLoginSuccess = () => {
    setIsModalOpen(false);
    // onAuthSuccess();
  };
  const handleOnSignUpSuccess = async (email: string, password: string) => {
    console.log("handleOnSignUpSuccess", email, password);
    const loginRes = await fetchData<any>("/auth/login", HttpMethod.POST, {
      email: email,
      password: password,
    });
    console.log("loginRes", loginRes);
    if (loginRes.error) {
      toast({
        description: "Auto login failed",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    setUser(loginRes.data);
    onAuthSuccess(loginRes.data.token);
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
            onAuthSuccess={(email, password) => {
              switchForm("verify");
              handleOnSignUpSuccess(email, password);
            }}
            onSignInClick={() => switchForm("login")}
          />
        );
      case "login":
        return (
          <LoginForm
            onAuthSuccess={handleLoginSuccess}
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
        return <OTPVerifyForm onAuthSuccess={handleVerifySuccess} />;
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
          <DialogDescription>
            {currentForm === "signup"
              ? "Sign Up"
              : currentForm === "forgot-password"
                ? "Forgot Password"
                : currentForm === "reset-password"
                  ? "Reset Password"
                  : currentForm === "verify" &&
                    "Enter the code that was sent to your email."}
          </DialogDescription>
        </DialogHeader>
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
