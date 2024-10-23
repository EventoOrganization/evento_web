import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { handleFieldChange } from "../eventActions";

const EnableChatCheckbox = () => {
  const { control } = useFormContext();
  const [checked, setChecked] = useState(false);
  const handleCheckboxChange = () => {
    setChecked((prevState) => {
      const newState = !prevState;
      handleFieldChange("includeChat", newState);
      return newState;
    });
  };
  return (
    <FormField
      control={control}
      name="includeChat"
      render={({}) => (
        <FormItem>
          <FormLabel>Enable Chat</FormLabel>
          <FormControl>
            <Switch checked={checked} onCheckedChange={handleCheckboxChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default EnableChatCheckbox;
