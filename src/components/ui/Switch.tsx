// src/components/ui/Switch.tsx

import React from "react";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange }) => {
  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
      />
      <span className="slider round"></span>
    </label>
  );
};

export default Switch;
