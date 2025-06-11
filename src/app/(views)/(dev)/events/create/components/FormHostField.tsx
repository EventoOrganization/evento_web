import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Porps = {
  username: string;
  handleChange: (
    fieldName: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
};

const FormHostField = ({ username, handleChange }: Porps) => {
  return (
    <div>
      <Label className="sr-only" htmlFor="username">
        Organizer Name
      </Label>
      <Input
        id="username"
        name="username"
        value={username}
        onChange={(e) => handleChange("username", e)}
        className="hidden"
        placeholder="Organizer name"
      />
    </div>
  );
};

export default FormHostField;
