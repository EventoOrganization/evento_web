"use client";
import React from "react";
import { Button, Input, Link } from "@nextui-org/react";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";
import { Checkbox } from "@nextui-org/react";
import GoogleIcon from "@/components/icons/GoogleIcon";
import AppleIcon from "@/components/icons/AppleIcon";

export default function SignIn() {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <>
      <div className="w-full h-screen">
        <div className="w-full p-6 bg-white rounded-lg shadow-lg h-screen">
          <div className="my-10">
            <h1 className="text-2xl font-bold">Sign in</h1>
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
            <Button
              radius="full"
              className="bg-gradient-to-tr from-pink-500 to-blue-500 text-white shadow-lg px-10 text-sm"
              size="lg"
            >
              Log in
            </Button>
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
