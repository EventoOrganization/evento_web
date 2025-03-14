import SmartImage from "@/components/SmartImage";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateEventStore } from "@/store/useCreateEventStore";
import { Camera } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

const EventImageUpload = () => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const eventStore = useCreateEventStore();
  const { register } = useFormContext();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(imageUrls);
    eventStore.setEventField("imagePreviews", imageUrls);
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  return (
    <FormField
      name="images"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex gap-2 items-center">
            <Camera className="w-4 h-4" />
            Min 1 Images
          </FormLabel>
          <FormControl>
            <Input
              type="file"
              // The field value should not be passed here to avoid the error
              {...register("images")}
              accept="image/*"
              multiple
              onChange={(e) => {
                // Call field.onChange with the files array directly
                field.onChange(e.target.files);
                handleImageChange(e);
              }}
              className="text-sm text-muted-foreground"
            />
          </FormControl>
          <div className="image-preview-container mt-4 grid grid-cols-3 gap-2 max-w-96">
            {imagePreviews.map((src, index) => (
              <div key={index} className="relative w-24 h-24">
                <SmartImage
                  src={src}
                  alt={`Image preview ${index}`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>
        </FormItem>
      )}
    />
  );
};

export default EventImageUpload;
