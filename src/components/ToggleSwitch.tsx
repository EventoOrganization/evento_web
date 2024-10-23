import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const ToggleSwitch = ({ isToggled, onToggle }: any) => {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="toggle" className="text-gray-700 sr-only">
        Enable option
      </Label>
      <Switch
        id="toggle"
        checked={isToggled}
        onCheckedChange={onToggle} // Correct event handler
      />
    </div>
  );
};

export default ToggleSwitch;
