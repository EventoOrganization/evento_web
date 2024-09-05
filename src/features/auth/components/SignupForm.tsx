import PasswordInput from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { signUpSchema } from "@/lib/zod";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const SignUpForm = ({
  onSignInClick,
  onAuthSuccess,
}: {
  onSignInClick?: () => void;
  onAuthSuccess: (email: string, password: string) => void;
}) => {
  const { toast } = useToast();

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

  const onSubmit: SubmitHandler<z.infer<typeof signUpSchema>> = async (
    data,
  ) => {
    setIsFetching(true);
    try {
      const signUpRes = await fetchData<any>("/auth/signup", HttpMethod.POST, {
        email: data.email,
        password: data.password,
      });

      if (signUpRes.error) {
        setError(signUpRes.error);
        toast({
          description: error,
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      toast({
        description: "Account created successfully",
        className: "bg-evento-gradient-button text-white",
        duration: 3000,
      });

      onAuthSuccess(data.email, data.password);
    } catch (error: unknown) {
      toast({
        description: "Signup or login failed",
        variant: "destructive",
        duration: 3000,
      });
      console.error("signup or login error", error);
      if (error instanceof Error) {
        form.setError("email", { type: "manual", message: error.message });
      } else {
        form.setError("email", { type: "manual", message: "Signup failed" });
      }
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" justify-between flex flex-col rounded-md p-4 h-full sm:h-auto  max-w-[400px] w-full mx-auto"
      >
        <div className="justify-center flex flex-col gap-4">
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
                <p className="text-destructive text-sm">
                  {form.formState.errors.email?.message}
                </p>
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
                <p className="text-destructive text-sm">
                  {form.formState.errors.password?.message}
                </p>
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
                <p className="text-destructive text-sm">
                  {form.formState.errors.confirmPassword?.message}
                </p>
              </FormItem>
            )}
          />
          <Button
            className="bg-evento-gradient-button rounded-full text-xs self-center px-8 mt-10 text-white"
            disabled={isFetching}
          >
            {isFetching ? "Signing up..." : "Sign up"}
          </Button>
        </div>
        <div className="mt-4 text-center w-full text-xs">
          <p className="text-sm sm:text-muted-foreground w-full flex justify-center sm:justify-between gap-2">
            Already have an account?
            <button
              className="underline text-eventoPurple"
              onClick={onSignInClick}
            >
              Sign In
            </button>
          </p>
        </div>
      </form>
    </FormProvider>
  );
};

export default SignUpForm;
