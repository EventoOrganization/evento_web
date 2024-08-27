import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import Switch from "@/components/ui/Switch";
import { useFormContext } from "react-hook-form";
import { handleFieldChange } from "../eventActions";

const EnableChatCheckbox = () => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name="includeChat"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Enable Chat</FormLabel>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={(checked: boolean) => {
                field.onChange(checked);
                handleFieldChange("includeChat", true);
              }}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default EnableChatCheckbox;
