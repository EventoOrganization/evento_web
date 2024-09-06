"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "@/contexts/SessionProvider";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useState } from "react";
import ForgotForm from "./ForgotForm";
import LoginForm from "./LoginForm";
import OTPVerifyForm from "./OTPVerifyForm";
import ResetPasswordForm from "./resest-password-form";
import SignUpForm from "./SignupForm";
import UserInfoForm from "./UserInfoForm";

const AuthModal = ({
  onAuthSuccess,
  onClose,
}: {
  onAuthSuccess: () => void;
  onClose: () => void;
}) => {
  const { startSession } = useSession();
  const { setUser } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [currentForm, setCurrentForm] = useState<
    | "login"
    | "signup"
    | "forgot-password"
    | "reset-password"
    | "verify"
    | "user-info"
  >("login");
  const handleLoginSuccess = () => {
    onAuthSuccess();
    setIsModalOpen(false);
  };
  const handleOnSignUpSuccess = async (email: string, password: string) => {
    const loginRes = await fetchData<any>("/auth/login", HttpMethod.POST, {
      email: email,
      password: password,
    });
    if (loginRes.error) {
      toast({
        description: "Auto login failed",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    setUser(loginRes.data);
    startSession(loginRes.data, loginRes.data.token);
    onAuthSuccess();
  };
  const switchForm = (
    form:
      | "login"
      | "signup"
      | "forgot-password"
      | "reset-password"
      | "verify"
      | "user-info",
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
            onAuthSuccess={() => handleLoginSuccess()}
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
        return <OTPVerifyForm onAuthSuccess={() => switchForm("user-info")} />;
      case "user-info":
        return <UserInfoForm onAuthSuccess={() => setIsModalOpen(false)} />;
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
                    : currentForm === "user-info"
                      ? "User Info"
                      : "Sign In"}{" "}
            to Continue
          </DialogTitle>
          <DialogDescription>
            {currentForm === "signup"
              ? "Sign Up"
              : currentForm === "forgot-password"
                ? "Enter your email address and we will send you a code to reset your password."
                : currentForm === "reset-password"
                  ? "Reset Password"
                  : currentForm === "verify"
                    ? "Enter the code that was sent to your email."
                    : currentForm === "user-info"
                      ? "Enter your username and profile image."
                      : "Enter your email and password."}
          </DialogDescription>
        </DialogHeader>
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
