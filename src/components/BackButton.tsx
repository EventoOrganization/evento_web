"use client";
import { cn } from "@/lib/utils";
import { ArrowBigLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const BackButton = ({ className }: { className?: string }) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <Button
      className={cn(
        "rounded-full h-10 w-10 p-0 aspect-square bg-evento-gradient-button shadow cursor-pointer z-10",
        className,
      )}
      onClick={handleBack}
    >
      <ArrowBigLeft />
    </Button>
  );
};

export default BackButton;
