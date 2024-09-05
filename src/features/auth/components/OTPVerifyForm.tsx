"use client";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { otpVerificationSchema } from "@/lib/zod";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const OTPVerifyForm = ({ onAuthSuccess }: { onAuthSuccess: () => void }) => {
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();
  console.log(isFetching);
  const form = useForm<z.infer<typeof otpVerificationSchema>>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      otpCode: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof otpVerificationSchema>> = async (
    data,
  ) => {
    setIsFetching(true);
    try {
      const verifyRes = await fetchData("/auth/verify-otp", HttpMethod.POST, {
        otpCode: data.otpCode,
      });
      if (verifyRes.error) {
        setError(verifyRes.error);
        toast({
          description: error,
          variant: "destructive",
          duration: 3000,
        });
      } else {
        toast({
          description: "OTP verified successfully",
          className: "bg-evento-gradient-button text-white",
          duration: 3000,
        });
        onAuthSuccess();
      }
    } catch (err) {
      toast({
        description: "Failed to verify OTP",
        variant: "destructive",
        duration: 3000,
      });
      if (err instanceof Error) {
        form.setError("otpCode", { message: err.message });
      } else {
        form.setError("otpCode", { message: "An unknown error occurred" });
      }
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="rounded-md p-4 flex flex-col gap-4 max-w-[400px] w-full mx-auto">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 items-center"
        >
          <FormField
            control={form.control}
            name="otpCode" // Changed from resetCode to otpCode
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center w-full">
                <FormLabel className="sr-only">Code</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                {form.formState.errors.otpCode?.message && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.otpCode.message}
                  </p>
                )}
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className={cn("bg-evento-gradient-button rounded-full w-fit px-6")}
          >
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
    </div>
  );
};

export default OTPVerifyForm;
