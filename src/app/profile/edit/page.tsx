"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/contexts/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import useEventoStore from "@/store/useEventoStore";
import { useProfileStore } from "@/store/useProfileStore";
import { fetchData, HttpMethod } from "@/utils/fetchData";
// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Social media platforms list
const socialPlatforms = ["instagram", "linkedin", "tiktok"];

const EditProfilePage = () => {
  const session = useSession();
  const { interests } = useEventoStore();
  const { userInfo, setProfileData } = useProfileStore((state) => state);
  const { toast } = useToast();
  // const router = useRouter();

  // Initialize form state based on userInfo
  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    firstName: userInfo?.firstName || "",
    lastName: userInfo?.lastName || "",
    address: userInfo?.address || "",
    bio: userInfo?.bio || "",
    URL: userInfo?.URL || "",
    DOB: userInfo?.DOB || "",
    interest: userInfo?.interest || [],
    socialLinks: userInfo?.socialLinks || [{ platform: "", url: "" }],
  });

  // State for the profile image file
  const [profileImage, setProfileImage] = useState<File | null>(null);

  // Sync userInfo into formData when userInfo changes (if needed)
  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || "",
        firstName: userInfo.firstName || "",
        lastName: userInfo.lastName || "",
        address: userInfo.address || "",
        bio: userInfo.bio || "",
        URL: userInfo.URL || "",
        DOB: userInfo.DOB || "",
        interest: userInfo.interest || [],
        socialLinks: userInfo.socialLinks || [{ platform: "", url: "" }],
      });
    }
  }, [userInfo]);

  // Handle form input changes for text fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle changes for social links
  const handleSocialLinkChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updatedLinks = [...formData.socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setFormData({ ...formData, socialLinks: updatedLinks });
  };

  // Add new social link
  const addSocialLink = () => {
    if (
      !formData.socialLinks.some(
        (link) => link.platform === "" && link.url === "",
      )
    ) {
      setFormData({
        ...formData,
        socialLinks: [...formData.socialLinks, { platform: "", url: "" }],
      });
    }
  };

  // Remove a social link
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

  // Handle interest selection change
  const handleInterestsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedInterestId = e.target.value;
    const selectedInterest = interests.find(
      (i) => i._id === selectedInterestId,
    );
    if (
      selectedInterest &&
      !formData.interest.some((i) => i._id === selectedInterestId)
    ) {
      setFormData({
        ...formData,
        interest: [...formData.interest, selectedInterest],
      });
    }
  };

  // Remove an interest from the form
  const removeInterest = (interestId: string) => {
    const updatedInterests = formData.interest.filter(
      (interest) => interest._id !== interestId,
    );
    setFormData({ ...formData, interest: updatedInterests });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = new FormData();

    // Add text data
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "socialLinks" && key !== "interest" && value) {
        dataToSend.append(key, value as string);
      }
    });

    // Add social links
    if (formData.socialLinks.length > 0) {
      dataToSend.append("socialLinks", JSON.stringify(formData.socialLinks));
    }

    // Add interests
    if (formData.interest.length > 0) {
      const interestIds = formData.interest.map((interest) => interest._id);
      dataToSend.append("interest", JSON.stringify(interestIds));
    }

    // Add profile image if selected
    if (profileImage) {
      dataToSend.append("profileImage", profileImage);
    }

    // Make API call to update the profile
    try {
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
        // Optionally: refresh the profile data
        setProfileData(updateRes.data);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-lg py-10">
      <h1 className="text-2xl font-semibold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <Label htmlFor="name">Username</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        {/* First Name */}
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>

        {/* Last Name */}
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        {/* Address */}
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        {/* Bio */}
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea name="bio" value={formData.bio} onChange={handleChange} />
        </div>

        {/* Interests */}
        <div>
          <Label htmlFor="interests">Interests</Label>
          <select onChange={handleInterestsChange}>
            <option value="">Choose interest...</option>
            {interests.map((interest) => (
              <option key={interest._id} value={interest._id}>
                {interest.name}
              </option>
            ))}
          </select>
          <div>
            {formData.interest.map((interest) => (
              <Button
                key={interest._id}
                onClick={() => removeInterest(interest._id as string)}
              >
                {interest.name} (remove)
              </Button>
            ))}
          </div>
        </div>

        {/* URL */}
        <div>
          <Label htmlFor="URL">URL</Label>
          <Input
            type="url"
            name="URL"
            value={formData.URL}
            onChange={handleChange}
          />
        </div>

        {/* Date of Birth */}
        <div>
          <Label htmlFor="DOB">Date of Birth</Label>
          <Input
            type="date"
            name="DOB"
            value={formData.DOB}
            onChange={handleChange}
          />
        </div>

        {/* Profile Image */}
        <div>
          <Label htmlFor="profileImage">Profile Image</Label>
          <Input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {/* Social Links */}
        <div>
          <Label htmlFor="socialLinks">Social Links</Label>
          {formData.socialLinks.map((link, index) => (
            <div key={index} className="flex gap-2">
              <select
                value={link.platform}
                onChange={(e) =>
                  handleSocialLinkChange(index, "platform", e.target.value)
                }
              >
                <option value="">Select a platform</option>
                {socialPlatforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </option>
                ))}
              </select>
              <Input
                type="url"
                value={link.url}
                onChange={(e) =>
                  handleSocialLinkChange(index, "url", e.target.value)
                }
              />
              <Button onClick={() => removeSocialLink(index)}>Remove</Button>
            </div>
          ))}
          <Button onClick={addSocialLink}>Add Social Link</Button>
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
