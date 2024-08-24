import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Camera } from "lucide-react";
import { handleFileUpload } from "../eventActions";

const EventImageUpload = () => {
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
            <>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  field.onChange(e);
                  handleFileUpload(e.target.files!);
                }}
                className="text-sm text-muted-foreground"
              />
            </>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default EventImageUpload;
