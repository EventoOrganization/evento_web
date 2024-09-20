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
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const ResetPasswordModal = ({
  onBackToSignIn, // Call this after the reset process
  token,
}: {
  onBackToSignIn?: () => void;
  token: string;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const passwordForm = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const handlePasswordSubmit: SubmitHandler<
    z.infer<typeof newPasswordSchema>
  > = async (data) => {
    setIsFetching(true);
    const body = {
      password: data.password,
      token,
    };
    const result = await fetchData(
      "/auth/reset-password",
      HttpMethod.POST,
      body,
    );
    if (!result?.ok) {
      setError(result?.error || "An error occurred. Please try again.");
      setIsFetching(false);
    } else {
      setIsFetching(false);

      if (onBackToSignIn) {
        onBackToSignIn();
      }
    }
  };

  return (
    <FormProvider {...passwordForm}>
      <form
        onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
        className="p-4 flex flex-col gap-4"
      >
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
        <Button
          type="submit"
          className={cn("bg-evento-gradient-button rounded-full w-fit px-6")}
          disabled={isFetching}
        >
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

export default ResetPasswordModal;
