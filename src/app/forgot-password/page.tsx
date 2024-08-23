import BackButton from "@/components/ui/BackButton";
import CustomButton from "@/components/ui/CustomButton";
import { Input } from "@nextui-org/react";
import React from "react";

export default function page() {
  return (
    <>
      <div className="bg-white h-screen">
        <div className="p-9 w-full max-w-lg mx-auto">
          <div className="mt-16">
            <BackButton />
          </div>
          <div className="text-3xl font-bold mt-8">Forgot Password</div>
          <div className="text-xs text-slate-300 mt-2.5">
            Insert your e-mail to receive password reset instructions
          </div>
          <div className="mt-10">
            <Input placeholder="E-mail address" size="lg" name="EmailAddress" />
          </div>
          <div className="flex justify-center mt-16">
            <CustomButton size="lg" radius="full" gradient>
              Next
            </CustomButton>
          </div>
        </div>
      </div>
    </>
  );
}
