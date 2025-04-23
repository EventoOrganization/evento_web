import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EditProfileImage from "@/features/profile/EditProfileImage";
import { useToast } from "@/hooks/use-toast";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { CameraIcon } from "lucide-react";
import { useState } from "react";

const QuickSignUpForm = ({
  onAuthSuccess,
  onSwitchToVerify,
  onSignInClick,
}: {
  onAuthSuccess: (email: string, password: string) => void;
  onSwitchToVerify?: () => void;
  onSignInClick?: () => void;
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [croppedProfileImage, setCroppedProfileImage] = useState<string | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateCroppedImage = (croppedImage: string | null) => {
    setCroppedProfileImage(croppedImage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);

    if (croppedProfileImage) {
      const response = await fetch(croppedProfileImage);
      const blob = await response.blob();
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
      formDataToSend.append("profileImage", file);
    }

    try {
      const response = await fetchData<any>(
        "/auth/quick-signup",
        HttpMethod.POST,
        formDataToSend,
        null,
      );

      if (response.ok) {
        toast({
          title: "Information added successfully.",
          description:
            "Your OTP code might be in your spam folder. Please check there if you don’t see it in your inbox!",
          className: "bg-evento-gradient text-white",
        });
        onAuthSuccess(formData.email, response?.data?.password);
        onSwitchToVerify && onSwitchToVerify();
      } else {
        toast({
          description: response.error || "Failed to add information.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating account:", error);
      toast({
        description: "An error occurred while adding information.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="justify-center flex flex-col p-10 ">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 space-y-4">
        {/* Champ de saisie pour le nom d'utilisateur */}
        <div className="w-full flex flex-col gap-2">
          <Label htmlFor="username" className="">
            Name<span className="text-red-500">*</span>
          </Label>
          <Input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />
        </div>
        {/* Champ de saisie pour l'email */}
        <div className="w-full flex flex-col gap-2">
          <Label htmlFor="email" className="block text-sm font-medium">
            Email<span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />
        </div>
        {/* Image de profil avec recadrage */}
        <div className=" flex flex-col gap-2 relative w-fit">
          <Label htmlFor="profileImage">
            Profile Picture {"("}Optional{")"}
          </Label>
          <EditProfileImage
            userInfo={undefined}
            onUpdateImage={handleUpdateCroppedImage}
          />
          <Label
            htmlFor="profileImage"
            className="p-2 border rounded absolute bottom-0 right-14 md:right-12 bg-background"
          >
            <CameraIcon />
          </Label>
        </div>
        {/* Bouton de soumission */}
        <Button
          type="submit"
          className="w-full bg-evento-gradient text-white p-2 rounded-md"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Connecting..." : "Continue"}
        </Button>{" "}
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
    </div>
  );
};

export default QuickSignUpForm;
