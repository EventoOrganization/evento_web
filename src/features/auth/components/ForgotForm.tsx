"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { emailSchema } from "@/lib/zod";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@nextui-org/theme";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const ForgotForm = ({
  onResetPasswordClick,
  onBackToSignIn,
}: {
  onResetPasswordClick: () => void; // You passed this in AuthModal
  onBackToSignIn?: () => void; // You passed this in AuthModal
}) => {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof emailSchema>> = async (data) => {
    setIsFetching(true);
    const formattedData = {
      ...data,
      email: data.email.toLowerCase(),
    };

    try {
      const result = await fetchData(
        "/auth/forgot-password",
        HttpMethod.POST,
        formattedData,
      );
      if (!result.ok) {
        toast({
          description: result.error || "An error occurred. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
        return;
      } else {
        setIsFetching(false);
        toast({
          description: "Please check your email for reset code",
          className: "bg-evento-gradient-button text-white",
          duration: 3000,
        });
        onResetPasswordClick();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
          <Button
            type="submit"
            className="bg-evento-gradient-button rounded-full text-xs self-center px-8 mt-10  text-white"
          >
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
              <button
                className="text-muted-foreground text-xs hover:underline w-full text-end cursor-pointer"
                onClick={onBackToSignIn} // Use onBackToSignIn when clicked
                disabled={isFetching}
              >
                Back to Sign In
              </button>
            </p>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default ForgotForm;
