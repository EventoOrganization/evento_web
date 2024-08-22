"use client";
import PasswordInput from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { newPasswordSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const ResetPasswordForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetCode = searchParams.get("code");

  const passwordForm = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!resetCode) {
      setError("Invalid or missing reset code.");
    }
  }, [resetCode]);

  const handlePasswordSubmit: SubmitHandler<
    z.infer<typeof newPasswordSchema>
  > = async (data) => {
    if (!resetCode) {
      setError("Invalid or missing reset code.");
      return;
    }
    setIsFetching(true);
    console.log(isFetching);
    const result = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        resetCode,
      }),
    });
    const resultData = await result.json();
    if (!result?.ok) {
      setError(resultData.message);
      setIsFetching(false);
    } else {
      setIsFetching(false);
      router.push(`/sign-in`);
    }
  };

  return (
    <FormProvider {...passwordForm}>
      <form
        onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
        className="bg-accent border shadow rounded-md p-4 flex flex-col gap-4 max-w-[400px] w-full mx-auto"
      >
        <div>
          <h2 className="text-center text-lg font-semibold ">
            Reset Your Password
          </h2>
          <p className="text-muted-foreground text-xs text-center">
            Enter your new password to reset your account.
          </p>
        </div>
        <FormField
          control={passwordForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Password</FormLabel>
              <FormControl>
                <PasswordInput
                  field={field}
                  placeholder="Enter your new password"
                  label="Password"
                />
              </FormControl>
              {passwordForm.formState.errors.password?.message && (
                <p className="text-sm font-medium text-destructive">
                  {passwordForm.formState.errors.password.message}
                </p>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={passwordForm.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput
                  field={field}
                  placeholder="Confirm your new password"
                  label="Confirm Password"
                />
              </FormControl>
              {passwordForm.formState.errors.confirmPassword?.message && (
                <p className="text-sm font-medium text-destructive">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </FormItem>
          )}
        />
        <Button type="submit" className={cn("w-full mt-2 text-sm h-fit p-1")}>
          {isFetching ? <Loader /> : "Reset Password"}
        </Button>
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
      </form>
    </FormProvider>
  );
};

export default ResetPasswordForm;
