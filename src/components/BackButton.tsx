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
      className="rounded-full h-10 w-10 p-0 aspect-square bg-evento-gradient-button shadow "
      onClick={handleBack}
    >
      <ArrowBigLeft />
    </Button>
  );
};

export default BackButton;
