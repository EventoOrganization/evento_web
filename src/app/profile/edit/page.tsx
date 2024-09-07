"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/contexts/SessionProvider";
import { handleProfileFieldChange } from "@/features/profile/profileActions";
import { useToast } from "@/hooks/use-toast";
import { useProfileStore } from "@/store/useProfileStore";
import { UserType } from "@/types/UserType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useState } from "react";

const EditProfilePage = () => {
  const session = useSession();
  const { userInfo } = useProfileStore((state) => state);
  const { toast } = useToast();

  // Set the form state with the current profile information
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    bio: "",
    URL: "",
    DOB: "",
  });

  // Separate state for the profile image file
  const [profileImage, setProfileImage] = useState<File | null>(null);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    handleProfileFieldChange(e.target.name as keyof UserType, e.target.value);
  };

  // Handle file input change for the profile image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create form data for the file upload if profileImage is selected
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        dataToSend.append(key, value as string);
      });
      if (profileImage) {
        dataToSend.append("profileImage", profileImage);
      }
      console.log("Data to send:", dataToSend);
      const updateRes = await fetchData<any>(
        "/profile/updateProfile",
        HttpMethod.PUT,
        dataToSend,
        session?.token,
      );

      if (updateRes.error) {
        toast({
          description: "Failed to update profile",
          variant: "destructive",
          duration: 3000,
        });
      } else {
        toast({
          description: "Profile updated successfully",
          className: "bg-evento-gradient-button text-white",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-lg py-10">
      <h1 className="text-2xl font-semibold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <Input
            type="text"
            name="firstName"
            id="firstName"
            placeholder={userInfo?.firstName}
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 block w-full"
          />
        </div>

        {/* Last Name */}
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <Input
            type="text"
            name="lastName"
            id="lastName"
            placeholder={userInfo?.lastName}
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full"
          />
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <Input
            type="text"
            name="address"
            id="address"
            placeholder={userInfo?.address}
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full"
          />
        </div>

        {/* Bio */}
        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700"
          >
            Bio
          </label>
          <Textarea
            name="bio"
            id="bio"
            placeholder={userInfo?.bio}
            value={formData.bio}
            onChange={handleChange}
            className="mt-1 block w-full"
            rows={4}
          />
        </div>

        {/* URL */}
        <div>
          <label
            htmlFor="URL"
            className="block text-sm font-medium text-gray-700"
          >
            URL
          </label>
          <Input
            type="url"
            name="URL"
            id="URL"
            placeholder={userInfo?.URL}
            value={formData.URL}
            onChange={handleChange}
            className="mt-1 block w-full"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <Label
            htmlFor="DOB"
            className="block text-sm font-medium text-gray-700"
          >
            Date of Birth
          </Label>
          <Input
            type="date"
            name="DOB"
            id="DOB"
            placeholder={userInfo?.DOB}
            value={formData.DOB ? formData.DOB : userInfo?.DOB}
            onChange={handleChange}
            className="mt-1 block w-full"
          />
        </div>

        {/* Profile Image */}
        <div>
          <label
            htmlFor="profileImage"
            className="block text-sm font-medium text-gray-700"
          >
            Profile Image
          </label>

          <Input
            type="file"
            accept="image/*"
            name="profileImage"
            id="profileImage"
            onChange={handleFileChange} // Handle file change separately
            className="mt-1 block w-full"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-evento-gradient-button text-white py-2"
        >
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default EditProfilePage;
