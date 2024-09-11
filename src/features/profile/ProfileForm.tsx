"use client";
import { useProfileStore } from "@/store/useProfileStore";
import { InterestType } from "@/types/EventType";
import { useEffect, useState } from "react";

type FormValues = {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  socialId?: string;
  socialType?: string | number;
  password?: string;
  countryCode?: string;
  phoneNumber: string;
  address?: string;
  DOB?: string;
  profileImage?: string;
  role?: string;
  bio?: string;
  deviceToken?: string;
  deviceType?: string;
  aboutMe?: string;
  otp?: number;
  phone_verified?: string;
  is_block?: number;
  is_otp_verify?: number;
  interests?: InterestType[];
};

const ProfileForm = () => {
  const userInfo = useProfileStore((state) => state.userInfo);

  // Initialize form values with userInfo or set empty defaults
  const [formValues, setFormValues] = useState<FormValues>({
    name: userInfo?.username || "",
    firstName: userInfo?.firstName || "",
    lastName: userInfo?.lastName || "",
    email: userInfo?.email || "",
    phoneNumber: userInfo?.phoneNumber || "",
    address: userInfo?.address || "",
    DOB: userInfo?.DOB || "",
    profileImage: userInfo?.profileImage || "",
    bio: userInfo?.bio || "",
    aboutMe: userInfo?.aboutMe || "",
    interests: userInfo?.interests || [],
  });

  const [editFields, setEditFields] = useState<string[]>([]); // Track which fields are editable

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // Use 'keyof FormValues' to ensure 'name' is a valid key and handle numbers
    setFormValues((prev) => ({
      ...prev,
      [name as keyof FormValues]:
        name === "otp" || name === "is_block" || name === "is_otp_verify"
          ? Number(value) // Convert to number for specific fields
          : value,
    }));
  };

  // Toggle edit mode for a specific field
  const toggleEditField = (field: string) => {
    setEditFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field],
    );
  };

  // Handle form submission
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (e.g., send formValues to server)
    console.log("Updated profile values:", formValues);
  };

  // Sync userInfo with formValues when userInfo updates (if fetched later)
  useEffect(() => {
    if (userInfo) {
      setFormValues({
        name: userInfo?.username || "",
        firstName: userInfo?.firstName || "",
        lastName: userInfo?.lastName || "",
        email: userInfo?.email || "",
        phoneNumber: userInfo?.phoneNumber || "",
        address: userInfo?.address || "",
        DOB: userInfo?.DOB || "",
        profileImage: userInfo?.profileImage || "",
        bio: userInfo?.bio || "",
        aboutMe: userInfo?.aboutMe || "",
        interests: userInfo?.interests || [],
      });
    }
  }, [userInfo]);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Map through all form fields */}
      {Object.keys(formValues).map((field) => (
        <div key={field}>
          <label className="block">
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <div className="flex items-center">
            <input
              type="text"
              name={field}
              value={formValues[field as keyof FormValues] as string} // Cast value correctly
              onChange={handleChange}
              className="border p-2 rounded w-full"
              readOnly={!editFields.includes(field)}
            />
            <button
              type="button"
              className="ml-4 text-blue-500"
              onClick={() => toggleEditField(field)}
            >
              {editFields.includes(field) ? "Done" : "Edit"}
            </button>
          </div>
        </div>
      ))}
      <div>
        <label className="block">Phone Number (with Country Code)</label>
        <div className="flex items-center">
          <input
            type="text"
            name="phoneNumber"
            value={formValues.phoneNumber || ""}
            onChange={handleChange}
            placeholder="+1 123 456 7890" // Exemple de format d'affichage
            className="border p-2 rounded w-full"
            readOnly={!editFields.includes("phoneNumber")}
          />
          <button
            type="button"
            className="ml-4 text-blue-500"
            onClick={() => toggleEditField("phoneNumber")}
          >
            {editFields.includes("phoneNumber") ? "Done" : "Edit"}
          </button>
        </div>
      </div>

      {/* Submit button */}
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Save Changes
      </button>
    </form>
  );
};

export default ProfileForm;
