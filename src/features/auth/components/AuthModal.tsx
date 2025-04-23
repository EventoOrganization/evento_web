"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useState } from "react";
import ForgotForm from "./ForgotForm";
import LoginForm from "./LoginForm";
import OTPVerifyForm from "./OTPVerifyForm";
import QuickSignUpForm from "./QuickSignUpForm";
import ResetPasswordForm from "./ResetPasswordForm";
import SignUpForm from "./SignupForm";

export const formStyle =
  "justify-between flex flex-col rounded-md p-2  h-full sm:h-auto  max-w-[400px] w-full mx-auto";

const AuthModal = ({
  onAuthSuccess,
  onClose,
  quickSignup,
  defaultForm = "signup",
}: {
  onAuthSuccess: (token?: string) => void;
  onClose?: () => void;
  quickSignup?: boolean;
  defaultForm?: string;
}) => {
  const { toast } = useToast();
  const [flowType, setFlowType] = useState<"signup" | "forgot-password">(
    "signup",
  );
  const { startSession } = useSession();
  const [resetPasswordToken, setResetPasswordToken] = useState<string | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [currentForm, setCurrentForm] = useState<
    | "login"
    | "signup"
    | "quick-signup"
    | "forgot-password"
    | "reset-password"
    | "verify"
    | "user-info"
  >(
    quickSignup
      ? "quick-signup"
      : (defaultForm as
          | "signup"
          | "forgot-password"
          | "login"
          | "quick-signup"
          | "reset-password"
          | "verify"
          | "user-info"),
  );

  const handleLoginSuccess = (token: string) => {
    if (token) onAuthSuccess(token);

    setIsModalOpen(false);
  };

  const handleOnSignUpSuccess = async (email: string, password?: string) => {
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
    console.log("loginRes.data", loginRes.data);
    startSession(loginRes.data, loginRes.data.token);
    if (!quickSignup) switchForm("verify");
  };

  const switchForm = (
    form:
      | "login"
      | "signup"
      | "quick-signup"
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
      case "quick-signup":
        return (
          <QuickSignUpForm
            onAuthSuccess={(email, password) => {
              handleOnSignUpSuccess(email, password);
            }}
            onSwitchToVerify={() => switchForm("verify")}
            onSignInClick={() => switchForm("login")}
          />
        );
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
                ? onClose && onClose()
                : switchForm("reset-password", token)
            }
            flowType={flowType}
          />
        );
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
        className="rounded-xl max-w-[95%] max-h-[80%] md:max-w-lg overflow-y-auto  px-4 pt-10 md:pt-4 pb-4 "
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader className="flex-row items-center gap-4 ">
          <div className="space-y-1">
            <DialogTitle>
              {currentForm === "quick-signup"
                ? "To join event, please add your info below."
                : currentForm === "signup"
                  ? "Sign Up"
                  : currentForm === "forgot-password"
                    ? "Forgot Password"
                    : currentForm === "reset-password"
                      ? "Reset Password"
                      : currentForm === "verify"
                        ? "Verify Code"
                        : "Sign In"}
            </DialogTitle>
            <DialogDescription>
              {currentForm === "quick-signup"
                ? ""
                : currentForm === "signup"
                  ? "Hello, welcome to Evento! Create your account now."
                  : currentForm === "forgot-password"
                    ? "Enter your email address and we will send you a code to reset your password."
                    : currentForm === "reset-password"
                      ? "Reset Password"
                      : currentForm === "verify"
                        ? "Enter the code that was sent to your email."
                        : "Welcome back! Please sign in."}
            </DialogDescription>
          </div>
        </DialogHeader>
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
