"use client";
import PasswordInput from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { signUpSchema } from "@/lib/zod";
import { useAuthStore } from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const SignUpForm = ({
  onAuthSuccess = () => {},
  shouldRedirect = true,
}: {
  onAuthSuccess?: () => void;
  shouldRedirect?: boolean;
}) => {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  const onSubmit: SubmitHandler<z.infer<typeof signUpSchema>> = async (
    data,
  ) => {
    setIsFetching(true);
    console.log(data);
    try {
      // Sign-up request
      const signUpRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (!signUpRes.ok) {
        setIsFetching(false);
        const errorData = await signUpRes.json();
        setError(errorData.message);
        throw new Error(errorData.message);
      }

      // Automatically log in the user after sign-up
      const loginRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // This ensures that cookies are sent/received
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        },
      );

      const loginResult = await loginRes.json();
      if (!loginRes.ok) {
        throw new Error(loginResult.message || "Login failed after signup");
      }

      const token = loginResult.body.token;
      const loginUserData = {
        _id: loginResult.body._id,
        name: loginResult.body.name,
        email: loginResult.body.email,
        token: token,
      };

      // Set user data in the store
      setUser(loginUserData);

      onAuthSuccess();

      // Redirect to home or profile page after login
      if (shouldRedirect) {
        router.push("/");
      }
    } catch (error: unknown) {
      console.error("signup or login error", error);
      if (error instanceof Error) {
        form.setError("email", { type: "manual", message: error.message });
      } else {
        form.setError("email", { type: "manual", message: "Signup failed" });
      }
    } finally {
      setIsFetching(false); // Ensure isFetching is false after the request completes
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="sm:bg-accent sm:border sm:shadow justify-between flex flex-col rounded-md p-4 h-full sm:h-auto  max-w-[400px] w-full mx-auto"
      >
        <div className="justify-center flex flex-col gap-4">
          <div>
            <h2 className={cn("sm:text-center text-xl font-semibold")}>
              Sign Up
            </h2>
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
          <Button
            type="button"
            onClick={() => {
              console.log("Button clicked");
              onSubmit({
                email: "test@example.com",
                password: "password",
                confirmPassword: "password",
              });
            }}
            className="bg-evento-gradient-button rounded-full text-xs self-center px-8 mt-10 text-white"
            disabled={isFetching}
          >
            {isFetching ? "Signing up..." : "Sign up"}
          </Button>
        </div>
        <div className="mt-4 text-center w-full text-xs">
          {shouldRedirect && (
            <p className="text-sm sm:text-muted-foreground w-full flex justify-center sm:justify-between gap-2">
              Already have an account?
              <Link href={`/signin`} className="underline text-eventoPurple">
                Sign In
              </Link>
            </p>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default SignUpForm;
