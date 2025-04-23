"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export const ConversationSidebar = ({
  isConvSelected,
  onSelect,
}: {
  isConvSelected: boolean;
  onSelect: () => void;
}) => (
  <aside
    className={cn(
      "w-full max-w-full md:max-w-xs border-r border-muted h-full overflow-y-auto bg-muted",
      { "hidden md:block": isConvSelected },
    )}
  >
    <ScrollArea className="h-full p-4">
      {[...Array(5)].map((_, i) => (
        <li
          key={i}
          className="rounded-md p-3 cursor-pointer transition-colors"
          onClick={onSelect}
        >
          <div className="font-medium">User {i + 1}</div>
          <div className="text-xs text-muted-foreground truncate">
            Latest message preview goes here...
          </div>
        </li>
      ))}
    </ScrollArea>
  </aside>
);
