"use client";

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
  <EzTag
    as="header"
    className="fixed top-0 p-4 border-b font-bold text-lg flex items-center gap-2 h-16 bg-background"
  >
    <Button
      variant={"ghost"}
      className={cn(
        "transition-all md:hidden p-1",
        !isConvSelected && "p-0 w-0",
      )}
      onClick={onBack}
    >
      {isConvSelected && (
        <ArrowLeftIcon className="w-5 h-5 text-muted-foreground" />
      )}
    </Button>

    <EzTag
      as="h1"
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
      Evento Chats
    </EzTag>
    {/* <EzTag as="div" className="ml-auto">
      <PresenceSwitcher />
    </EzTag> */}
  </EzTag>
);
