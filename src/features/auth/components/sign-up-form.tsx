"use client";
import PasswordInput from "@/components/PasswordInput";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, cn } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const SignUpForm = () => {
  const [isFetching, setIsFetching] = useState(false);
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  console.log(isFetching);

  const onSubmit: SubmitHandler<z.infer<typeof signUpSchema>> = async (
    data,
  ) => {
    setIsFetching(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        setIsFetching(false);
        const errorData = await res.json();
        throw new Error(errorData.message);
      }

      setIsFetching(false);
    } catch (error: unknown) {
      console.error("signup", error);
      if (error instanceof Error) {
        form.setError("email", { type: "manual", message: error.message });
      } else {
        form.setError("email", { type: "manual", message: "Signup failed" });
      }
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="sm:bg-accent sm:border sm:shadow justify-between flex flex-col rounded-md p-4 h-full sm:h-auto  max-w-[400px] w-full mx-auto"
      >
        {" "}
        <div className="justify-center flex flex-col gap-4">
          <div>
            <h2 className={cn("sm:text-center text-xl font-semibold")}>
              Sign Up
            </h2>
            {/* <p className="text-muted-foreground text-xs text-center">
              Welcome! Please fill in the details to get started.
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    field={field}
                    placeholder={"Confirm Password"}
                    label={"Confirm Password"}
                  />
                </FormControl>
                {form.formState.errors.confirmPassword?.message}
              </FormItem>
            )}
          />
          <Button className="bg-evento-gradient-button rounded-full text-xs self-center px-8 mt-10  text-white">
            Sign up
          </Button>
        </div>
        <div className="mt-4 text-center w-full text-xs">
          <p className="text-sm sm:text-muted-foreground w-full flex justify-center sm:justify-between gap-2">
            Already have an account?
            <Link href={`/signin`} className="underline text-eventoPurple">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </FormProvider>
  );
};

export default SignUpForm;
