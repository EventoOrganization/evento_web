import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

type Props = {
  title: string;
  handleFieldUpdate: (
    fieldName: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
};

const FormTitleInput = ({ title, handleFieldUpdate }: Props) => {
  return (
    <div className="space-y-1">
      <Label htmlFor="title">
        Title<span className="text-red-500">*</span>
      </Label>
      <Input
        id="title"
        name="title"
        value={title}
        onChange={(e) => handleFieldUpdate("title", e)}
        placeholder="Enter"
      />
    </div>
  );
};

export default FormTitleInput;
