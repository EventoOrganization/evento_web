import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

type Props = {
  className?: string;
  onClick?: () => void;
};

const AddButton = ({ className, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "cursor-pointer relative flex items-center justify-center max-w-24 min-w-24 h-24 rounded-md m-1 border-2 border-dashed border-gray-300 hover:border-eventoPurpleLight focus:outline-none",
        className,
      )}
    >
      <span className="flex items-center justify-center w-12 h-12 rounded-md bg-eventoPurpleDark text-white ">
        <Plus className="w-6 h-6" />
      </span>
    </button>
  );
};

export default AddButton;
