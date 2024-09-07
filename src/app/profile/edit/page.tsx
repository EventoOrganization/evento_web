"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/contexts/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { useProfileStore } from "@/store/useProfileStore";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useRouter } from "next/navigation";
import { useState } from "react";

const socialPlatforms = [
  // "facebook",
  // "google",
  // "twitter",
  "instagram",
  "linkedin",
  "tiktok",
  // "youtube",
];
const EditProfilePage = () => {
  const session = useSession();
  const { userInfo } = useProfileStore((state) => state);
  const { toast } = useToast();
  const router = useRouter();
  // Set the form state with the current profile information
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    bio: "",
    URL: "",
    DOB: "",
    socialLinks: [{ platform: "", url: "" }],
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
    // handleProfileFieldChange(e.target.name as keyof UserType, e.target.value);
  };
  // Handle social links changes
  const handleSocialLinkChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    setFormData((prevFormData) => {
      const updatedLinks = [...prevFormData.socialLinks];
      updatedLinks[index] = {
        ...updatedLinks[index],
        [field]: value,
      };
      // handleProfileFieldChange("socialLinks", value, index, field);
      return { ...prevFormData, socialLinks: updatedLinks };
    });
  };

  const addSocialLink = () => {
    setFormData({
      ...formData,
      socialLinks: [...formData.socialLinks, { platform: "", url: "" }],
    });
  };
  const removeSocialLink = (index: number) => {
    const updatedLinks = formData.socialLinks.filter((_, i) => i !== index);
    setFormData({ ...formData, socialLinks: updatedLinks });
  };
  // Handle file input change for the profile image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create form data for the file upload if profileImage is selected
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value === "" || value === null) {
          dataToSend.append(key, "null");
        } else if (key === "socialLinks") {
          dataToSend.append(key, JSON.stringify(value));
        } else {
          dataToSend.append(key, value as string);
        }
      });
      if (profileImage) {
        dataToSend.append("profileImage", profileImage);
      }
      dataToSend.forEach((value, key) => {
        console.log("dataToSend", `${key}: ${value}`);
      });
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
    } finally {
      router.push("/profile");
    }
  };

  return (
    <div className="container mx-auto max-w-lg py-10">
      <h1 className="text-2xl font-semibold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <div>
          <Label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </Label>
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
          <Label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </Label>
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
          <Label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </Label>
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
          <Label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700"
          >
            Bio
          </Label>
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
          <Label
            htmlFor="URL"
            className="block text-sm font-medium text-gray-700"
          >
            URL
          </Label>
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
          <Label
            htmlFor="profileImage"
            className="block text-sm font-medium text-gray-700"
          >
            Profile Image
          </Label>

          <Input
            type="file"
            accept="image/*"
            name="profileImage"
            id="profileImage"
            onChange={handleFileChange}
            className="mt-1 block w-full"
          />
        </div>

        {/* Social Links */}
        <div>
          <Label htmlFor="socialLinks">Social Links</Label>

          {formData.socialLinks.map((link, index) => (
            <div
              key={index}
              className="flex items-center gap-2 flex-col w-full md:flex-row"
            >
              {/* Platform Select */}
              <select
                value={link.platform}
                onChange={(e) =>
                  handleSocialLinkChange(index, "platform", e.target.value)
                }
                className="w-full md:w-1/3 mt-4 px-3 py-2 rounded border"
              >
                <option value="">Select Platform</option>
                {socialPlatforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </option>
                ))}
              </select>

              {/* URL Input */}
              <Input
                type="url"
                value={link.url}
                onChange={(e) =>
                  handleSocialLinkChange(index, "url", e.target.value)
                }
                placeholder="URL"
                className="md:w-2/3"
              />

              {/* Remove Link Button */}
              <Button
                type="button"
                className="hidden md:block"
                onClick={() => removeSocialLink(index)}
              >
                Remove
              </Button>
            </div>
          ))}

          <Button
            type="button"
            className="bg-blue-500 mt-2"
            onClick={addSocialLink}
          >
            Add Social Link
          </Button>
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
