"use client";
import Section from "@/components/layout/Section";
import ForgotForm from "@/features/auth/components/forgot-form";
import SignInForm from "@/features/auth/components/LoginForm";
import VerifyCodeForm from "@/features/auth/components/OTPVerifyForm";
import ResetPasswordForm from "@/features/auth/components/resest-password-form";
import SignUpForm from "@/features/auth/components/SignupForm";

import Link from "next/link";
import { useParams } from "next/navigation";

const FormPage = () => {
  const { auth: form } = useParams();
  let FormComponent;
  let formProps = {};

  switch (form) {
    case "forgot-password":
      FormComponent = ForgotForm;
      break;
    case "reset-password":
      FormComponent = ResetPasswordForm;
      break;
    case "signin":
      FormComponent = SignInForm;
      formProps = {
        onSignUpClick: () => {},
        shouldRedirect: true,
        onAuthSuccess: () => {},
        className: "",
      };
      break;
    case "signup":
      FormComponent = SignUpForm;
      formProps = {
        onSignInClick: () => {},
        shouldRedirect: true,
        onAuthSuccess: () => {},
        className: "",
      };
      break;
    case "verify-reset-code":
      FormComponent = VerifyCodeForm;
      break;
    default:
      return (
        <Section className="absolute bg-background w-full h-full top-0 left-0 z-10 gap-10">
          <p>not-found</p>
          <Link href="/" className="hover:underline">
            go-back
          </Link>
        </Section>
      );
  }

  return (
    <>
      <p></p>
    </>
  );
};

export default FormPage;
