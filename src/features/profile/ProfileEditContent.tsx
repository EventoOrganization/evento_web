"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/contexts/SessionProvider";
import EditProfileImage from "@/features/profile/EditProfileImage";
import { useToast } from "@/hooks/use-toast";
import { useGlobalStore } from "@/store/useGlobalStore";
import { InterestType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { cn } from "@nextui-org/theme";
import { useJsApiLoader } from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
// Social media platforms list
const socialPlatforms = ["instagram", "linkedin", "tiktok"];
const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = [
  "places",
];
const ProfileEditContent = () => {
  const session = useSession();
  const maxChars = 155;
  const { setProfileData } = useGlobalStore((state) => state);
  // const userInfo = useGlobalStore((state) => state.userInfo);
  const [userInfo, setUserInfo] = useState<UserType | null>(null);
  const interests = useGlobalStore((state) => state.interests);
  const { toast } = useToast();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [croppedProfileImage, setCroppedProfileImage] = useState<string | null>(
    userInfo?.profileImage || "",
  );
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-maps-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const loadUser = async (token: string) => {
    try {
      const userRes = await fetchData(
        `/profile/getLoggedUserProfile`,
        HttpMethod.GET,
        null,
        token,
      );
      if (userRes && !userRes.error && userRes.data) {
        setUserInfo(userRes.data as UserType);
      } else {
        console.error("Erreur lors du fetch de l'utilisateur:", userRes?.error);
      }
    } catch (error) {
      console.error("Erreur lors du fetch de l'utilisateur:", error);
    }
  };

  useEffect(() => {
    if (session.isAuthenticated && session.token) {
      loadUser(session.token);
    }
  }, [session.isAuthenticated, session.token]);
  // Initialize form state based on userInfo
  const [formData, setFormData] = useState({
    username: userInfo?.username || "",
    firstName: userInfo?.firstName || "",
    lastName: userInfo?.lastName || "",
    address: userInfo?.address || "",
    bio: userInfo?.bio || "",
    URL: userInfo?.URL || "",
    DOB: userInfo?.DOB || "",
    interests: userInfo?.interests || [],
    socialLinks: userInfo?.socialLinks || [{ platform: "", url: "" }],
    profileImage: userInfo?.profileImage || "",
  });

  // State for the profile image file
  // const [profileImage, setProfileImage] = useState<File | null>(null);
  const handleUpdateCroppedImage = (croppedImage: string | null) => {
    setCroppedProfileImage(croppedImage);
  };
  // Sync userInfo into formData when userInfo changes (if needed)
  useEffect(() => {
    if (userInfo) {
      setFormData({
        username: userInfo.username || "",
        firstName: userInfo.firstName || "",
        lastName: userInfo.lastName || "",
        address: userInfo.address || "",
        bio: userInfo.bio || "",
        URL: userInfo.URL || "",
        DOB: userInfo.DOB || "",
        interests: userInfo.interests || [],
        socialLinks: userInfo.socialLinks || [],
        profileImage: userInfo.profileImage || "",
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
        (link: { platform: string; url: string }) =>
          link.platform === "" && link.url === "",
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
    const updatedLinks = formData.socialLinks.filter(
      (_: any, i: number) => i !== index,
    );
    setFormData({ ...formData, socialLinks: updatedLinks });
  };

  // Handle interest selection change
  const handleInterestsChange = (selectedInterest: InterestType) => {
    const isSelected = formData.interests.some(
      (i: InterestType) => i._id === selectedInterest._id,
    );
    setFormData({
      ...formData,
      interests: isSelected
        ? formData.interests.filter(
            (i: InterestType) => i._id !== selectedInterest._id,
          )
        : [...formData.interests, selectedInterest],
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = new FormData();

    // Add text data
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "socialLinks" && key !== "interests" && value) {
        dataToSend.append(key, value as string);
      }
    });

    // Add social links
    if (formData.socialLinks.length > 0) {
      dataToSend.append("socialLinks", JSON.stringify(formData.socialLinks));
    }
    // add ProfileImage
    if (croppedProfileImage) {
      const response = await fetch(croppedProfileImage);
      const blob = await response.blob();
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
      dataToSend.append("profileImage", file);
    }
    // Add interests
    if (formData.interests.length > 0) {
      const interestIds = formData.interests.map(
        (interest: InterestType) => interest._id,
      );
      dataToSend.append("interest", JSON.stringify(interestIds));
    }

    try {
      const updateRes = await fetchData<any>(
        "/profile/updateProfile",
        HttpMethod.PUT,
        dataToSend,
        session?.token,
      );

      if (updateRes.error) {
        console.log(updateRes);
        toast({
          description: `${updateRes.error}`,
          variant: "destructive",
          duration: 3000,
        });
        return;
      } else {
        toast({
          description: "Profile updated successfully",
          className: "bg-evento-gradient-button text-white",
          duration: 3000,
        });
        setProfileData(updateRes.data);
        router.push("/profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  useEffect(() => {
    if (isLoaded && window.google && inputRef.current && !autocomplete) {
      try {
        const newAutocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          { types: ["geocode"] },
        );
        setAutocomplete(newAutocomplete);

        newAutocomplete.addListener("place_changed", () => {
          const place = newAutocomplete.getPlace();
          if (place.geometry) {
            const address = place.formatted_address || "";
            setFormData((prevData) => ({
              ...prevData,
              address: address,
            }));
          }
        });
      } catch (error) {
        console.error(
          "Failed to initialize Google Places Autocomplete:",
          error,
        );
      }
    }
  }, [isLoaded, inputRef.current, autocomplete]);

  return (
    <div className="px-4 mx-auto max-w-lg py-10">
      <h1 className="text-2xl font-semibold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Image */}

        <EditProfileImage
          userInfo={userInfo || undefined}
          onUpdateImage={handleUpdateCroppedImage}
        />
        {/* Username */}
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            name="username"
            value={
              formData.username.charAt(0).toUpperCase() +
              formData.username.slice(1)
            }
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
            ref={inputRef}
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        {/* Bio */}
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            maxLength={155}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="resize-none mb-1"
          />
          <div className="text-right text-sm text-gray-500">
            {formData.bio.length}/{maxChars} characters
          </div>
        </div>

        {/* Interests */}
        <div>
          <Label>Interests</Label>
          <ul className="flex flex-wrap gap-4 justify-between ">
            {interests.map((interest) => (
              <li key={interest._id} className="list-none">
                <Button
                  type="button"
                  className={cn(
                    "cursor-pointer bg-gray-200 text-black hover:bg-eventoPurpleLight/60",
                    {
                      "bg-evento-gradient text-white": formData.interests.some(
                        (i: InterestType) => i._id === interest._id,
                      ),
                    },
                  )}
                  onClick={() => handleInterestsChange(interest)}
                >
                  {interest.name}
                </Button>
              </li>
            ))}
          </ul>
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

        {/* Social Links */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="socialLinks">Social Links</Label>
          {formData.socialLinks.map(
            (link: { platform: string; url: string }, index: number) => (
              <div key={index} className="flex flex-col md:flex-row gap-2">
                <select
                  value={link.platform}
                  className="p-2 border border-gray-300 rounded"
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
                <Button
                  type="button"
                  onClick={() => removeSocialLink(index)}
                  className="bg-gray-300 text-black hover:bg-gray-200"
                  variant={"ghost"}
                >
                  Remove
                </Button>
              </div>
            ),
          )}
          <Button
            type="button"
            onClick={addSocialLink}
            className="hover:bg-eventoBlue bg-eventoBlue  hover:opacity-80 mt-2 w-fit"
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

export default ProfileEditContent;
