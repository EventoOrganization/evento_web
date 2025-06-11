"use client";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/togglerbtn";
import { useState } from "react";
const EnableChatButton = ({
  onChange,
}: {
  onChange: (value: boolean) => void;
}) => {
  const [checked, setChecked] = useState(false);

  const handleButtonClick = () => {
    setChecked(!checked);
    onChange(!checked);
  };

  return (
    <div className="flex items-center gap-2">
      <Switch checked={checked} onClick={handleButtonClick} />
      <Label>Enable Chat</Label>
    </div>
  );
};

export default EnableChatButton;
