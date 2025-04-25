"use client";

import SmartImage from "@/components/SmartImage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import EzTag from "@ezstart/ez-tag";
import { ArrowLeftIcon } from "lucide-react";

export const ChatHeader = ({
  isConvSelected,
  onBack,
}: {
  isConvSelected: boolean;
  onBack: () => void;
}) => (
  <div className="p-4 border-b font-bold text-lg flex items-center gap-2 h-16 bg-background">
    <Button
      variant={"ghost"}
      className={cn("transition-all md:hidden", !isConvSelected && "p-0 w-0")}
      onClick={onBack}
    >
      {isConvSelected && (
        <ArrowLeftIcon className="w-5 h-5 text-muted-foreground" />
      )}
    </Button>

    <div
      className={cn(
        "flex items-center gap-2 transition-all duration-300 ease-in-out",
        {
          "translate-x-2": isConvSelected,
        },
      )}
    >
      <EzTag
        as="img"
        src="/evento-logo.png"
        alt="logo"
        width={30}
        height={30}
      />
      <SmartImage
        src="/evento-logo.png"
        alt="logo"
        width={30}
        height={30}
        className="object-contain"
        forceImg
      />
      <span>Evento Chats</span>
    </div>
  </div>
);
