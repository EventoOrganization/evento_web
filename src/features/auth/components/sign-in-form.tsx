"use client";
import PasswordInput from "@/components/PasswordInput";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { signInSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const SignInForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const formStyle =
    "sm:bg-accent sm:border sm:shadow justify-between flex flex-col rounded-md p-4 h-full sm:h-auto  max-w-[400px] w-full mx-auto";
  const onSubmit: SubmitHandler<z.infer<typeof signInSchema>> = async (
    data,
  ) => {
    setIsFetching(true);
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    console.log(isFetching);

    if (result?.error) {
      setError(result.error);
      setIsFetching(false);
    } else {
      setIsFetching(false);
      router.push(`/`);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={formStyle}>
        <div className="justify-center flex flex-col gap-4">
          <div>
            <h2 className={cn("sm:text-center text-xl font-semibold")}>
              Sign In
            </h2>
            {/* <p className="text-muted-foreground text-xs text-center">
              Welcome back! Please sign in to continue
            </p> */}
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Email</FormLabel>
                <FormControl>
                  <Input
                    className="rounded-xl bg-muted sm:bg-background placeholder:opacity-50 placeholder:text-muted-foreground"
                    placeholder={"Email"}
                    {...field}
                  />
                </FormControl>
                {form.formState.errors.email?.message}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    field={field}
                    placeholder={"Password"}
                    label={"Password"}
                  />
                </FormControl>

                {form.formState.errors.password?.message}
              </FormItem>
            )}
          />
          <div className="flex flex-col ">
            <p className="text-sm text-muted-foreground w-full flex justify-between gap-2 items-center mt-1">
              <Link
                href={`/forgot-password`}
                className="text-muted-foreground text-xs hover:underline w-full text-end"
              >
                Forgot Password?
              </Link>
            </p>
            {error && (
              <div className="flex gap-1 items-center">
                <span className="bg-destructive rounded-full p-1 text-destructive-foreground w-4 h-4 flex justify-center items-center text-xs">
                  !
                </span>
                <p className="text-destructive text-sm font-semibold text-start">
                  {error}
                </p>
              </div>
            )}
            <Button className="bg-evento-gradient-button rounded-full text-xs self-center px-8 mt-10  text-white">
              Sign in
            </Button>
          </div>
        </div>
        <div className="mt-4 text-justify text-xs w-full ">
          <p className="text-sm sm:text-muted-foreground w-full flex justify-center sm:justify-between gap-2">
            Don't have an account?
            <Link href={`/signup`} className="underline text-eventoPurple">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </FormProvider>
  );
};

export default SignInForm;
