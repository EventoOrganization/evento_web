"use client";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { resetCodeSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
const OTPVerifyForm = ({
  onBackToSignIn, // Call this when the user wants to switch back to sign-in
}: {
  onBackToSignIn?: () => void;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter();

  const codeForm = useForm<z.infer<typeof resetCodeSchema>>({
    resolver: zodResolver(resetCodeSchema),
    defaultValues: {
      resetCode: "",
    },
  });

  const handleCodeSubmit: SubmitHandler<
    z.infer<typeof resetCodeSchema>
  > = async (data) => {
    setIsFetching(true);
    console.log(isFetching);
    const result = await fetch("/api/auth/verify-reset-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const resultData = await result.json();
    if (!result?.ok) {
      setError(resultData.message);
      setIsFetching(false);
    } else {
      setIsFetching(false);
      router.push(`/reset-password?code=${data.resetCode}`); // Redirect to reset password page with the code
    }
  };

  return (
    <div className="bg-accent border shadow rounded-md p-4 flex flex-col gap-4 max-w-[400px] w-full mx-auto">
      <FormProvider {...codeForm}>
        <form onSubmit={codeForm.handleSubmit(handleCodeSubmit)}>
          <div>
            <h2 className="text-center text-lg font-semibold ">Verify Code</h2>
            <p className="text-muted-foreground text-xs text-center">
              Enter the code that was sent to your email.
            </p>
          </div>
          <FormField
            control={codeForm.control}
            name="resetCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your code" {...field} />
                </FormControl>
                {codeForm.formState.errors.resetCode?.message && (
                  <p className="text-sm font-medium text-destructive">
                    {codeForm.formState.errors.resetCode.message}
                  </p>
                )}
              </FormItem>
            )}
          />
          <Button type="submit" className={cn("w-full mt-2 text-sm h-fit p-1")}>
            Verify
          </Button>
        </form>
      </FormProvider>
      {error && (
        <div className="flex gap-1 items-center mt-2">
          <span className="bg-destructive rounded-full p-1 text-destructive-foreground w-4 h-4 flex justify-center items-center text-xs">
            !
          </span>
          <p className="text-destructive text-sm font-normal text-start">
            {error}
          </p>
        </div>
      )}
      <div className="mt-4 text-justify text-xs w-full">
        <p className="text-sm text-muted-foreground w-full flex justify-between gap-2 mt-2">
          {onBackToSignIn ? (
            <span
              className="text-muted-foreground text-xs hover:underline w-full text-end cursor-pointer"
              onClick={onBackToSignIn} // Use onBackToSignIn to switch back to sign-in form
            >
              Back to Sign In
            </span>
          ) : (
            <Link
              href="/auth/sign-in"
              className="text-muted-foreground text-xs hover:underline w-full text-end"
            >
              Back to Sign In
            </Link>
          )}
        </p>
      </div>
    </div>
  );
};

export default OTPVerifyForm;
