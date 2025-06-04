// components/FormInterestsField.tsx
import { Label } from "@/components/ui/label";
import { InterestType } from "@/types/EventType";
import { Check } from "lucide-react";

type Props = {
  interests: InterestType[];
  selectedInterests: InterestType[];
  onChange: (updated: InterestType[]) => void;
};

const FormInterestsField = ({
  interests,
  selectedInterests,
  onChange,
}: Props) => (
  <div>
    <Label htmlFor="interests">Interests Category</Label>
    <ul className="flex flex-wrap gap-2 mt-2">
      {interests.map((interest) => {
        const isSelected = selectedInterests.some(
          (i) => i._id === interest._id,
        );
        return (
          <li
            key={interest._id}
            onClick={() => {
              let updated;
              if (isSelected) {
                updated = selectedInterests.filter(
                  (i) => i._id !== interest._id,
                );
              } else {
                updated = [...selectedInterests, interest];
              }
              onChange(updated);
            }}
            className={`cursor-pointer px-2 py-2 rounded-md border text-sm w-fit flex items-center justify-center ${
              isSelected
                ? "bg-black text-white"
                : "bg-gray-200 text-muted-foreground hover:bg-gray-300"
            }`}
          >
            {isSelected && <Check className="mr-2 w-4 h-4" />}
            {interest.name}
          </li>
        );
      })}
    </ul>
  </div>
);

export default FormInterestsField;
