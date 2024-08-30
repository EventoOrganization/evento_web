"use client";
import { ArrowBigLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const BackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <Button
      className="md:hidden z-50 fixed top-4 left-4 rounded-full p-0 aspect-square bg-evento-gradient-button shadow"
      onClick={handleBack}
    >
      <ArrowBigLeft />
    </Button>
  );
};

export default BackButton;
