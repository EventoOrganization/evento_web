"use client";

import { cn } from "@/lib/utils";

const Burger = ({
  setIsOpen,
  isOpen,
  className,
}: {
  setIsOpen?: (isOpen: boolean) => void;
  isOpen: boolean;
  className?: string;
}) => {
  const handleClick = () => {
    if (setIsOpen) {
      setIsOpen(!isOpen);
    }
  };
  return (
    <button
      onClick={handleClick}
      className={cn(
        "relative h-8 w-8  flex flex-col justify-evenly items-center border-none",
        className,
      )}
    >
      <span
        className={cn(
          "block  h-0.5 w-5 bg-white transform transition duration-500 ease-in-out",
          isOpen ? "rotate-45 bg-black translate-y-2" : "rotate-0 ",
        )}
      />
      <span
        className={cn(
          "block  h-0.5 w-5 bg-white transform transition duration-500 ease-in-out",
          isOpen ? "opacity-0" : "opacity-100",
        )}
      />
      <span
        className={cn(
          "block  h-0.5 w-5 bg-white transform transition duration-500 ease-in-out",
          isOpen ? "-rotate-45 bg-black -translate-y-2 " : "rotate-0 ",
        )}
      />
    </button>
  );
};

export default Burger;
