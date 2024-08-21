"use client";

import { signup } from "@/app/(auth)/signup/actions";
import { getMessageFromCode } from "@/utils/Helper";
import { Input, Spinner } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import BackButton from "../ui/BackButton";
import CustomButton from "../ui/CustomButton";

export default function SignupForm() {
  const router = useRouter();
  const [result, dispatch] = useFormState(signup, undefined);

  useEffect(() => {
    if (result) {
      if (result.type === "error") {
        toast.error(getMessageFromCode(result.resultCode));
      } else {
        toast.success(getMessageFromCode(result.resultCode));
        router.refresh();
      }
    }
  }, [result, router]);

  return (
    <form
      action={dispatch}
    >
      <div className='bg-white h-screen'>
        <div className="p-9 w-full max-w-lg mx-auto">
          <div className="mt-16">
            <BackButton />
          </div>
          <div className="text-3xl font-bold mt-8">
            Sign up
          </div>
          <div className="mt-10">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-zinc-400"
              htmlFor="email"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email address"
              size="lg"
              required
            />
          </div>
          <div className="mt-5">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-zinc-400"
              htmlFor="password"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Enter password"
              required
              minLength={6}
              size="lg"
            />
          </div>
          <div className="flex justify-center mt-16">
            <LoginButton />
          </div>
          <div>
            <p className="text-center mt-20 text-sm text-zinc-400">Already have an account?
              <Link href="/signin" className="ml-2 font-semibold underline">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <>
      <CustomButton size="lg" radius="full" gradient aria-disabled={pending}>
        {pending ? <Spinner /> : "Create account"}
      </CustomButton>
    </>
  );
}
