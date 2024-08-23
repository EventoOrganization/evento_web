"use client";
import PasswordInput from "@/components/PasswordInput";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { signInSchema } from "@/lib/zod";
import { useAuthStore } from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

// Extend signInSchema to include rememberMe
const extendedSignInSchema = signInSchema.extend({
  rememberMe: z.boolean().optional(),
});

const SignInForm = () => {
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
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const formStyle =
    "sm:bg-accent sm:border sm:shadow justify-between flex flex-col rounded-md p-4 h-full sm:h-auto max-w-[400px] w-full mx-auto";

  const onSubmit: SubmitHandler<z.infer<typeof extendedSignInSchema>> = async (
    data,
  ) => {
    setIsFetching(true);
    console.log(isFetching);

    try {
      const loginResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
        // `http://localhost:8747/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        },
      );
      const loginResult = await loginResponse.json();
      if (!loginResponse.ok) {
        throw new Error(loginResult.message || "Login failed");
      }

      const token = loginResult.body.token;
      const loginUserData = {
        _id: loginResult.body._id,
        name: loginResult.body.name,
        email: loginResult.body.email,
        token: token,
      };

      // Étape 2 : Utilisation du token pour récupérer le profil complet
      const profileResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/getProfile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Utilisation du token pour l'authentification
          },
          credentials: "include",
        },
      );

      const profileResult = await profileResponse.json();
      if (!profileResponse.ok) {
        throw new Error(profileResult.message || "Profile fetch failed");
      }
      console.log("Full profile data received:", profileResult.body);
      const userInfo = profileResult.body.userInfo;
      const userToStore = {
        ...loginUserData, // Inclure les données de la connexion (comme le token)
        countryCode: userInfo.countryCode,
        createdAt: userInfo.createdAt,
        updatedAt: userInfo.updatedAt,
        profileImage: userInfo.profileImage, // Par exemple, vous pouvez choisir de stocker ou non certaines informations
        eventsAttended: profileResult.body.totalEventAttended,
        following: profileResult.body.following,
      };

      console.log("User data to store in Zustand:", userToStore);

      // Étape 3 : Stocker le profil utilisateur complet dans Zustand
      setUser(userToStore);

      setIsFetching(false);
      router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
      setIsFetching(false);
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
            <div className="flex justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem>
                    <span className="flex gap-2 items-center">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked: boolean | string | null) =>
                          field.onChange(!!checked)
                        }
                      />
                      <p>Remember me</p>
                    </span>
                  </FormItem>
                )}
              />

              <p className="text-sm text-muted-foreground flex justify-between gap-2 items-center mt-1 ">
                <Link
                  href={`/forgot-password`}
                  className="text-muted-foreground text-xs hover:underline w-full text-end"
                >
                  Forgot Password?
                </Link>
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
              type="submit"
              className="bg-evento-gradient-button rounded-full text-xs self-center px-8 mt-10  text-white"
            >
              Sign in
            </Button>
          </div>
        </div>
        <div className="mt-4 text-justify text-xs w-full ">
          <p className="text-sm sm:text-muted-foreground w-full flex justify-center sm:justify-between gap-2">
            Don&apos;t have an account?
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
