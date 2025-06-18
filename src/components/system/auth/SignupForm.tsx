import PasswordInput from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EditProfileImage from "@/features/profile/EditProfileImage";
import { useToast } from "@/hooks/use-toast";
import { signUpSchema } from "@/lib/zod";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { zodResolver } from "@hookform/resolvers/zod";
import { CameraIcon } from "lucide-react";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { formStyle } from "./AuthModal";

const SignUpForm = ({
  onSignInClick,
  onAuthSuccess,
}: {
  onSignInClick?: () => void;
  onAuthSuccess: (email: string, password: string) => void;
}) => {
  const { toast } = useToast();
  const [isFetching, setIsFetching] = useState(false);
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      profileImage: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof signUpSchema>> = async (
    data,
  ) => {
    setIsFetching(true);
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);
      if (data.profileImage) {
        const response = await fetch(data.profileImage);
        const blob = await response.blob();
        const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
        formData.append("profileImage", file);
      }
      const signUpRes = await fetchData<any>(
        "/auth/new-signup",
        HttpMethod.POST,
        formData,
        null,
      );

      if (!signUpRes.ok) {
        toast({
          description: signUpRes.error,
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      toast({
        title: "Account created successfully",
        description:
          "Your OTP code might be in your spam folder. Please check there if you don’t see it in your inbox!",
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
      <form onSubmit={form.handleSubmit(onSubmit)} className={formStyle}>
        <div className="justify-center flex flex-col gap-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Name<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className="rounded-xl bg-muted sm:bg-background placeholder:opacity-50 placeholder:text-muted-foreground"
                    placeholder={"Name"}
                    {...field}
                  />
                </FormControl>
                <p className="text-destructive text-sm">
                  {form.formState.errors.username?.message}
                </p>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email<span className="text-destructive">*</span>
                </FormLabel>
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
                <FormLabel>
                  Password<span className="text-destructive">*</span>
                </FormLabel>
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
                <FormLabel>
                  Confirm Password<span className="text-destructive">*</span>
                </FormLabel>
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
          <FormField
            control={form.control}
            name="profileImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Picture (Optional)</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-2 relative w-fit">
                    <EditProfileImage
                      userInfo={undefined}
                      onUpdateImage={(croppedImage: string | null) => {
                        field.onChange(croppedImage);
                      }}
                    />
                    <Label
                      htmlFor="profileImage"
                      className="p-2 border rounded absolute bottom-0 -right-5 bg-background"
                    >
                      <CameraIcon />
                    </Label>
                  </div>
                </FormControl>
                <p className="text-destructive text-sm">
                  {form.formState.errors.profileImage?.message}
                </p>
              </FormItem>
            )}
          />

          <Button
            className="bg-evento-gradient-button rounded-full  self-center px-8 py-2 mt-6 text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
            disabled={isFetching}
          >
            {isFetching ? "Signing up..." : "Sign-up"}
          </Button>
        </div>
        <div className="mt-4 text-center w-full text-xs">
          <p className="text-sm sm:text-muted-foreground w-full flex justify-center sm:justify-between gap-2">
            Already have an account?
            <button
              type="button"
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
