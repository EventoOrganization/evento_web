import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Film } from "lucide-react";

const EventVideoUpload = () => {
  return (
    <FormField
      name="video"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex gap-2 items-center">
            <Film className="w-4 h-4" />
            Max 1 Video
          </FormLabel>
          <FormControl>
            <>
              <Input
                type="file"
                accept="video/*"
                // onChange={(e) => {
                //   field.onChange(e);
                //   handleFileUpload(e.target.files!);
                // }}
                className="text-sm text-muted-foreground"
              />
            </>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default EventVideoUpload;
