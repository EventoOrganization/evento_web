"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { emailSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@nextui-org/theme";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const ForgotForm = ({
  onResetPasswordClick,
  onBackToSignIn,
}: {
  onResetPasswordClick?: () => void;
  onBackToSignIn?: () => void;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });
  const router = useRouter();
  const formStyle =
    "bg-accent border shadow rounded-md p-4 flex flex-col gap-4 max-w-[400px] mx-auto";

  const onSubmit: SubmitHandler<z.infer<typeof emailSchema>> = async (data) => {
    setIsFetching(true);
    console.log(isFetching);

    try {
      const result = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const resultData = await result.json();

      if (!result.ok) {
        // Accéder à la propriété 'error' dans le corps de la réponse JSON
        setError(resultData.error || "An unknown error occurred");
      } else {
        setIsFetching(false);
        router.push(`/verify-reset-code`);
      }
    } catch (err) {
      // Gestion d'erreur générique
      setError("An error occurred. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={formStyle}>
        <div>
          <h2 className="text-center text-lg font-semibold ">
            Forgot your password?
          </h2>
          <p className="text-muted-foreground text-xs text-center">
            Enter your email address and we&apos;ll send you a code to reset
            your password.
          </p>
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              {form.formState.errors.email?.message && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.email?.message}
                </p>
              )}
            </FormItem>
          )}
        />
        <div>
          <Button type="submit" className={cn("w-full mt-2 text-sm h-fit p-1")}>
            Get my reset code
          </Button>
          <div className={cn("grid  mt-1", { "grid-cols-2": error })}>
            {error && (
              <div className="flex gap-1 items-center">
                <span className="bg-destructive rounded-full p-1 text-destructive-foreground w-4 h-4 flex justify-center items-center text-xs">
                  !
                </span>
                <p className="text-destructive text-sm font-normal text-start">
                  {error}
                </p>
              </div>
            )}
            <p className="text-sm text-muted-foreground w-full flex justify-between gap-2 items-center">
              <Link
                href={`/sign-in`}
                className="text-muted-foreground text-xs hover:underline w-full text-end"
              >
                Back to Sign In
              </Link>
            </p>
          </div>
        </div>
        <div className="mt-4 text-justify text-xs w-full">
          <p className="text-sm text-muted-foreground w-full flex justify-between gap-2">
            Don&apos;t have an account?
            <Link href={`/sign-up`} className="text-primary underline">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </FormProvider>
  );
};

export default ForgotForm;
