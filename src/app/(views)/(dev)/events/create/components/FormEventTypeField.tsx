// components/FormEventTypeField.tsx
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const FormEventTypeField = ({ value, onChange }: Props) => (
  <div>
    <Label htmlFor="eventType">
      Event Format<span className="text-red-500">*</span>
    </Label>
    <RadioGroup
      className="flex items-center gap-4 mt-2"
      value={value}
      onValueChange={onChange}
    >
      <Label className="flex items-center gap-2">
        <RadioGroupItem value="public" id="public" />
        Public
      </Label>
      <Label className="flex items-center gap-2">
        <RadioGroupItem value="private" id="private" />
        Private
      </Label>
    </RadioGroup>
  </div>
);

export default FormEventTypeField;
