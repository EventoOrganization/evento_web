// components/FormDescriptionField.tsx
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const FormDescriptionField = ({ value, onChange }: Props) => (
  <div>
    <Label htmlFor="description">
      Description<span className="text-destructive">*</span>
    </Label>
    <Textarea
      id="description"
      name="description"
      value={value}
      onChange={onChange}
      placeholder="Enter event description"
    />
  </div>
);

export default FormDescriptionField;
