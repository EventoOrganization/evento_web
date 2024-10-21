"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSession } from "@/contexts/SessionProvider";
import EditProfileImage from "@/features/profile/EditProfileImage";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useGlobalStore } from "@/store/useGlobalStore";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const userInfoSchema = z.object({
  username: z.string().min(1, "Username is required"),
  profileImage: z.string().optional(),
});

const UserInfoForm = ({ onAuthSuccess }: { onAuthSuccess: () => void }) => {
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();
  const { setUser } = useAuthStore();
  const session = useSession();
  const setProfileData = useGlobalStore((state) => state.setProfileData);
  const [croppedProfileImage, setCroppedProfileImage] = useState<string | null>(
    session?.user?.profileImage || null,
  );

  const form = useForm<z.infer<typeof userInfoSchema>>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      username: session?.user?.username || "",
      profileImage: croppedProfileImage || "",
    },
  });

  const handleUpdateCroppedImage = (croppedImage: string | null) => {
    setCroppedProfileImage(croppedImage);
    form.setValue("profileImage", croppedImage || "");
  };

  const onSubmit: SubmitHandler<z.infer<typeof userInfoSchema>> = async (
    data,
  ) => {
    setIsFetching(true);
    const formData = new FormData();

    formData.append("username", data.username);

    // Si une image est recadrée, la transformer en blob
    if (croppedProfileImage) {
      const response = await fetch(croppedProfileImage);
      const blob = await response.blob();
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
      formData.append("profileImage", file);
    }

    try {
      const updateRes = await fetchData<any>(
        "/profile/updateProfile",
        HttpMethod.PUT,
        formData,
        session?.token,
      );

      if (updateRes.error) {
        toast({
          description: `${updateRes.error}`,
          variant: "destructive",
          duration: 3000,
        });
      } else {
        toast({
          description: "User info updated successfully",
          className: "bg-evento-gradient-button text-white",
          duration: 3000,
        });

        const updatedUser = {
          _id: updateRes.data._id,
          email: updateRes.data.email,
          username: data.username,
          profileImage: updateRes.data.profileImage || croppedProfileImage,
        };

        setUser(updatedUser);
        setProfileData(updateRes.data);
        onAuthSuccess();
      }
    } catch (err) {
      toast({
        description: "An error occurred while updating user info",
        variant: "destructive",
        duration: 3000,
      });
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
          {/* Avatar section avec composant de recadrage */}
          <EditProfileImage
            userInfo={session.user || undefined}
            onUpdateImage={handleUpdateCroppedImage}
          />

          {/* Username input */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="sr-only">Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your username"
                    className="input-class"
                  />
                </FormControl>
                {form.formState.errors.username && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className={cn("bg-evento-gradient-button rounded-full w-fit px-6")}
            disabled={isFetching}
          >
            {isFetching ? "Updating..." : "Update Info"}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default UserInfoForm;
