"use client";
import React from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import { Spinner } from "@nextui-org/spinner";
import { getMessageFromCode } from "@/utils/Helper";
import { useRouter } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { authenticate } from "@/app/(auth)/signin/actions";
import { Input, Link } from "@nextui-org/react";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";
import { Checkbox } from "@nextui-org/react";
import GoogleIcon from "@/components/icons/GoogleIcon";
import AppleIcon from "@/components/icons/AppleIcon";
import CustomButton from "@/components/ui/CustomButton";
import BackButton from "@/components/ui/BackButton";

export default function SignIn() {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const router = useRouter();
  const [result, dispatch] = useFormState(authenticate, undefined);

  useEffect(() => {
    if (result) {
      if (result.type === "error") {
        toast.error(getMessageFromCode(result.resultCode));
        router.refresh();
      } else {
        toast.success(getMessageFromCode(result.resultCode));
        router.refresh();
      }
    }
  }, [result, router]);

  function LoginButton() {
    const { pending } = useFormStatus();
    return (
      <>
        <CustomButton
          radius="full"
          className="bg-gradient-to-tr from-pink-500 to-blue-500 text-white shadow-lg px-10 text-sm"
          size="lg"
          aria-disabled={pending}
          type="submit"
        >
          {pending ? <Spinner /> : "Log in"}
        </CustomButton>
      </>
    );
  }

  return (
    <>
      <form action={dispatch} className="bg-white h-screen w-full">\
        <div className="p-9 max-w-lg mx-auto">
          <div className="mt-16">
            <BackButton />
          </div>
          <div className="text-3xl font-bold mt-8">Sign in</div>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="E-mail"
            size="lg"
            className="my-6"
          />
          <Input
            placeholder="Password"
            id="password"
            size="lg"
            className="my-6"
            name="password"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
                aria-label="toggle password visibility"
              >
                {isVisible ? <EyeSlashFilledIcon /> : <EyeFilledIcon />}
              </button>
            }
            type={isVisible ? "text" : "password"}
          />
          <div className="flex justify-between items-center text-xs my-6">
            <div className="flex-1 text-xs">
              <Checkbox>
                <div className="text-xs">Remember me</div>
              </Checkbox>
            </div>
            <div className="text-right">Forgot password?</div>
          </div>
          <div className="flex justify-center">
            <LoginButton />
          </div>
          <div className="flex justify-center mt-20 gap-10">
            <div className="shadow-lg p-3 rounded-lg">
              <GoogleIcon />
            </div>
            <div className="shadow-lg p-3 rounded-lg">
              <AppleIcon />
            </div>
          </div>
          <div>
            <p className="text-center mt-20 text-md font-bold">
              Don't have an account?
              <Link href="/signup" className="ml-2">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </form>
    </>
  );
}
