// components/FormModeField.tsx
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const FormModeField = ({ value, onChange }: Props) => (
  <div>
    <Label htmlFor="mode">
      Event Format<span className="text-red-500">*</span>
    </Label>
    <RadioGroup
      className="flex items-center gap-4 mt-2"
      value={value}
      onValueChange={onChange}
    >
      <Label className="flex items-center gap-2">
        <RadioGroupItem value="virtual" id="virtual" />
        Virtual
      </Label>
      <Label className="flex items-center gap-2">
        <RadioGroupItem value="in-person" id="in-person" />
        In person
      </Label>
      <Label className="flex items-center gap-2">
        <RadioGroupItem value="both" id="both" />
        Both
      </Label>
    </RadioGroup>
  </div>
);

export default FormModeField;
