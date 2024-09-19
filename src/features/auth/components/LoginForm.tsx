"use client";
import PasswordInput from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSession } from "@/contexts/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { signInSchema } from "@/lib/zod";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
const extendedSignInSchema = signInSchema.extend({
  rememberMe: z.boolean().optional(),
});

const LoginForm = ({
  onAuthSuccess = () => {},
  className,
  onSignUpClick,
  onForgotPasswordClick,
}: {
  onAuthSuccess?: (token: string) => void;
  className?: string;
  onSignUpClick?: () => void;
  onForgotPasswordClick?: () => void;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const form = useForm<z.infer<typeof extendedSignInSchema>>({
    resolver: zodResolver(extendedSignInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  const { setUser, user, rememberMe } = useAuthStore((state) => state);
  const { startSession } = useSession();
  const { toast } = useToast();
  const formStyle =
    "justify-between flex flex-col rounded-md p-4 h-full sm:h-auto max-w-[400px] w-full mx-auto";
  const onSubmit: SubmitHandler<z.infer<typeof extendedSignInSchema>> = async (
    data,
  ) => {
    setIsFetching(true);

    try {
      // Call fetchData and handle the result
      const { data: loginResult, error } = await fetchData<any>(
        "/auth/login",
        HttpMethod.POST,
        {
          email: data.email.toLowerCase(),
          password: data.password,
        },
      );
      if (error) {
        toast({
          description: error,
          variant: "destructive",
          duration: 3000,
        });
        throw new Error(error);
      }

      if (!loginResult?.token) {
        throw new Error("Login failed: No token returned.");
      }

      const token = loginResult.token;
      const loginUserData = {
        _id: loginResult._id,
        username: loginResult.username,
        email: loginResult.email,
        profileImage: loginResult.profileImage,
        token: token,
      };
      // Set user data in the store
      setUser(loginUserData);
      startSession(loginUserData, token);

      toast({
        description: "Sign in successful!",
        className: "bg-evento-gradient-button text-white",
        duration: 3000,
      });
      onAuthSuccess(token);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsFetching(false);
    }
  };
  useEffect(() => {
    if (rememberMe && user) {
      form.setValue("email", user.email);
    }
  }, [rememberMe, user, form]);
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(formStyle, className)}
      >
        <div className="justify-center flex flex-col gap-4">
          <div></div>
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
            <div className="flex justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem>
                    <span className="flex gap-2 items-center">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked: boolean | string | null) => {
                          field.onChange(!!checked);
                        }}
                      />
                      <p>Remember me</p>
                    </span>
                  </FormItem>
                )}
              />
              <p className="text-sm text-muted-foreground flex justify-between gap-2 items-center mt-1 ">
                <button
                  type="button"
                  className="text-muted-foreground text-xs hover:underline w-full text-end cursor-pointer"
                  onClick={onForgotPasswordClick}
                >
                  Forgot Password?
                </button>
              </p>
            </div>
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
              onClick={() => form.handleSubmit(onSubmit)()}
              className="bg-evento-gradient-button rounded-full text-xs self-center px-8 mt-10  text-white"
              disabled={isFetching} // Disable button while fetching
            >
              {isFetching ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </div>
        <div className="mt-4 text-justify text-xs w-full ">
          <p className="text-sm sm:text-muted-foreground w-full flex justify-center sm:justify-between gap-2">
            Don&apos;t have an account?
            <button
              type="button"
              className="underline text-eventoPurple"
              onClick={onSignUpClick}
            >
              Sign Up
            </button>
          </p>
        </div>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
