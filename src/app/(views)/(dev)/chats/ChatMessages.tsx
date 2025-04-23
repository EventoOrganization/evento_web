"use client";

import { cn } from "@/lib/utils";

export const ChatMessages = () => {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-4 py-2 space-y-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={cn("max-w-[75%] p-3 rounded-lg", {
            "self-start bg-muted": i % 2 === 0,
            "self-end bg-evento-gradient text-white": i % 2 === 1,
          })}
        >
          Message {i + 1}
        </div>
      ))}
    </div>
  );
};
