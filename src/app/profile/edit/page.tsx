"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/contexts/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { useProfileStore } from "@/store/useProfileStore";
import { InterestType } from "@/types/EventType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useJsApiLoader } from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Social media platforms list
const socialPlatforms = ["instagram", "linkedin", "tiktok"];
const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = [
  "places",
];
const EditProfilePage = () => {
  const session = useSession();
  const [interests, setInterests] = useState<InterestType[]>([]);
  const { userInfo, setProfileData } = useProfileStore((state) => state);
  const { toast } = useToast();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-maps-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });
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
  });

  // State for the profile image file
  const [profileImage, setProfileImage] = useState<File | null>(null);

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
  const loadInterests = async () => {
    try {
      const interestRes = await fetchData("/users/getInterestsListing");
      if (interestRes && !interestRes.error) {
        setInterests(interestRes.data as InterestType[]);
      } else {
        console.error("Failed to fetch interests:", interestRes?.error);
      }
    } catch (error) {
      console.error("Error fetching interests:", error);
    }
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
      !formData.interests.some((i) => i._id === selectedInterestId)
    ) {
      setFormData({
        ...formData,
        interests: [...formData.interests, selectedInterest],
      });
    }
  };

  // Remove an interest from the form
  const removeInterest = (interestId: string) => {
    const updatedInterests = formData.interests.filter(
      (interests) => interests._id !== interestId,
    );
    setFormData({ ...formData, interests: updatedInterests });
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

    // Add interests
    if (formData.interests.length > 0) {
      const interestIds = formData.interests.map((interest) => interest._id);
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
    } finally {
      router.push("/profile");
    }
  };
  useEffect(() => {
    loadInterests();
  }, []);

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
    <div className="container mx-auto max-w-lg py-10">
      <h1 className="text-2xl font-semibold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            name="username"
            value={formData.username}
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
          <Textarea name="bio" value={formData.bio} onChange={handleChange} />
        </div>

        {/* Interests */}
        <div>
          <Label htmlFor="interests">Interests</Label>
          <select
            onChange={handleInterestsChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Choose interest...</option>
            {interests.map((interest) => (
              <option key={interest._id} value={interest._id}>
                {interest.name}
              </option>
            ))}
          </select>
          <div className="flex gap-2 py-2">
            {formData.interests.map((interest) => (
              <Button
                key={interest._id}
                className="bg-evento-gradient hover:opacity-80"
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
        <div className="flex flex-col gap-2">
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
              <Button
                type="button"
                onClick={() => removeSocialLink(index)}
                className="bg-gray-300 text-black hover:bg-gray-200"
                variant={"ghost"}
              >
                Remove
              </Button>
            </div>
          ))}
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

export default EditProfilePage;
