"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { useAuthStore } from "@/store/useAuthStore";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const userInfoSchema = z.object({
  username: z.string().min(1, "Username is required"),
  profileImage: z.instanceof(File).optional(),
});

const UserInfoForm = ({ onAuthSuccess }: { onAuthSuccess: () => void }) => {
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();
  const { setUser } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const session = useSession();
  const form = useForm<z.infer<typeof userInfoSchema>>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      username: "",
      profileImage: undefined,
    },
  });
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      form.setValue("profileImage", file);
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof userInfoSchema>> = async (
    data,
  ) => {
    setIsFetching(true);
    const formData = new FormData();

    formData.append("username", data.username);
    if (data.profileImage) {
      formData.append("profileImage", data.profileImage);
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
          description: "Failed to update user info",
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
          _id: updateRes.data._id, // S'assurer que vous récupérez l'ID
          email: updateRes.data.email, // S'assurer que vous récupérez l'email
          username: data.username,
          profileImage: updateRes.data.profileImage || selectedImage,
          // Ajouter toute autre propriété nécessaire
        };

        setUser(updatedUser); // Passer un objet complet conforme à UserType
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
          {/* Avatar section */}
          <FormField
            control={form.control}
            name="profileImage"
            render={() => (
              <FormItem className="w-full flex flex-col items-center">
                <FormLabel className="sr-only">Profile Image</FormLabel>
                <label
                  htmlFor="file-input"
                  className="text-eventoPurple underline cursor-pointer mt-2"
                >
                  <Avatar className="w-20 h-20 md:w-36 md:h-36 cursor-pointer">
                    <AvatarImage
                      src={selectedImage || "https://github.com/shadcn.png"}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="file-input"
                  onChange={handleImageChange}
                />
                {form.formState.errors.profileImage && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.profileImage.message}
                  </p>
                )}
              </FormItem>
            )}
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
