import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const SearchInput = () => {
  return (
    <div className="relative w-full">
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="w-5 h-5 text-eventoPink" />
      </span>
      <Input
        type="text"
        placeholder="Search Friend"
        className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-eventoPink focus:border-eventoPink"
      />
    </div>
  );
};

export default SearchInput;
