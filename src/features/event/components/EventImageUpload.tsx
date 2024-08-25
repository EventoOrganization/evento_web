import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEventStore } from "@/store/useEventStore";
import { Camera } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
const EventImageUpload = ({ field }: { field: any }) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const eventStore = useEventStore();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log("Selected Images:", files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(imageUrls);
    eventStore.setEventField("imagePreviews", imageUrls);
    console.log(imageUrls);
    field.onChange(files);
  };

  return (
    <FormItem>
      <FormLabel className="flex gap-2 items-center">
        <Camera className="w-4 h-4" />
        Min 1 Images
      </FormLabel>
      <FormControl>
        <>
          <Input
            type="file"
            {...field}
            accept="image/*"
            multiple
            onChange={(e) => {
              field.onChange(e);
              handleImageChange(e);
            }}
            className="text-sm text-muted-foreground"
          />
        </>
      </FormControl>
      <div className="image-preview-container mt-4 grid grid-cols-3 gap-2 max-w-96">
        {imagePreviews.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`Image preview ${index}`}
            width={100}
            height={100}
            layout="responsive"
            className="rounded-lg"
          />
        ))}
      </div>
    </FormItem>
  );
};

export default EventImageUpload;
