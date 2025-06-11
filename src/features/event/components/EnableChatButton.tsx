"use client";
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
      <h6 className="">Enable Chat</h6>
    </div>
  );
};

export default EnableChatButton;
