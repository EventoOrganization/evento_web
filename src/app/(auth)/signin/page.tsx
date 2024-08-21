"use client";
import React from "react";
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
  return (
    <>
      <div className="bg-white h-screen w-full">
        <div className="p-9 max-w-lg mx-auto">
          <div className="mt-16">
            <BackButton />
          </div>
          <div className="text-3xl font-bold mt-8">
            Sign in
          </div>
          <Input type="email" label="E-mail" className="my-6" color="default" />
          <Input
            label="Password"
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
            <CustomButton
              radius="full"
              className="bg-gradient-to-tr from-pink-500 to-blue-500 text-white shadow-lg px-10 text-sm"
              size="lg"
            >
              Log in
            </CustomButton>
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
              <Link href="#" className="ml-2">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
