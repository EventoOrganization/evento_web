"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "@/contexts/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useState } from "react";
import ForgotForm from "./ForgotForm";
import LoginForm from "./LoginForm";
import OTPVerifyForm from "./OTPVerifyForm";
import ResetPasswordForm from "./ResetPasswordForm";
import SignUpForm from "./SignupForm";
import UserInfoForm from "./UserInfoForm";

const AuthModal = ({
  onAuthSuccess,
  onClose,
}: {
  onAuthSuccess: (token: string) => void; // Correction ici
  onClose?: () => void;
}) => {
  const { toast } = useToast();
  const [flowType, setFlowType] = useState<"signup" | "forgot-password">(
    "signup",
  );
  const { startSession } = useSession();
  const { setUser } = useAuthStore();
  const [resetPasswordToken, setResetPasswordToken] = useState<string | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [currentForm, setCurrentForm] = useState<
    | "login"
    | "signup"
    | "forgot-password"
    | "reset-password"
    | "verify"
    | "user-info"
  >("login");

  const handleLoginSuccess = (token: string) => {
    if (token) onAuthSuccess(token);

    setIsModalOpen(false);
  };

  const handleOnSignUpSuccess = async (email?: string, password?: string) => {
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
    console.log("loginRes.data", loginRes.data);
    startSession(loginRes.data, loginRes.data.token);
    switchForm("verify");
  };

  const switchForm = (
    form:
      | "login"
      | "signup"
      | "forgot-password"
      | "reset-password"
      | "verify"
      | "user-info",
    token?: string,
  ) => {
    if (form === "signup") {
      setFlowType("signup");
    } else if (form === "forgot-password") {
      setFlowType("forgot-password");
    }
    if (token) {
      setResetPasswordToken(token); // Store the token in state
    }
    setCurrentForm(form);
  };

  const renderForm = () => {
    switch (currentForm) {
      case "signup":
        return (
          <SignUpForm
            onAuthSuccess={(email, password) => {
              handleOnSignUpSuccess(email, password);
            }}
            onSignInClick={() => switchForm("login")}
          />
        );
      case "login":
        return (
          <LoginForm
            onAuthSuccess={(token) => handleLoginSuccess(token)}
            onSignUpClick={() => switchForm("signup")}
            onForgotPasswordClick={() => switchForm("forgot-password")}
          />
        );
      case "forgot-password":
        return (
          <ForgotForm
            onResetPasswordClick={() => switchForm("verify")}
            onBackToSignIn={() => switchForm("login")}
          />
        );
      case "reset-password":
        return (
          <ResetPasswordForm
            onBackToSignIn={() => switchForm("login")}
            token={resetPasswordToken || ""}
          />
        );
      case "verify":
        return (
          <OTPVerifyForm
            onAuthSuccess={(token) =>
              flowType === "signup"
                ? switchForm("user-info")
                : switchForm("reset-password", token)
            }
            flowType={flowType}
          />
        );
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
        setIsModalOpen(open);
        if (!open && onClose) onClose();
      }}
    >
      <DialogContent
        className="rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader className="flex-row items-center gap-4 ">
          <div className="space-y-1">
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
                ? "Hello, welcome to Evento! Create your account now."
                : currentForm === "forgot-password"
                  ? "Enter your email address and we will send you a code to reset your password."
                  : currentForm === "reset-password"
                    ? "Reset Password"
                    : currentForm === "verify"
                      ? "Enter the code that was sent to your email."
                      : currentForm === "user-info"
                        ? "Enter your username and profile image."
                        : "Welcome back! Please sign in to continue."}
            </DialogDescription>
          </div>
        </DialogHeader>
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
