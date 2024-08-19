import AdjustmentsIcon from "@/components/icons/AdjustmentsIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import { Input } from "@nextui-org/react";

function Search() {
  return (
    <>
      <div className="flex items-center bg-white mt-4 p-3 rounded-md">
        <SearchIcon />
        <Input key="outside" type="text" placeholder="Search" size="lg" />
        <AdjustmentsIcon />
      </div>
    </>
  );
}

export default Search;
