"use client";

import { formatTime } from "@/utils/formatTime";
import { MessageType } from "../types";
import { formatDateLabel } from "../utils/formatDateLabel";

interface MessagesListProps {
  messages: MessageType[];
  userId: string | undefined;
  bottomRef: React.RefObject<HTMLDivElement>;
}

export function MessagesList({
  messages,
  userId,
  bottomRef,
}: MessagesListProps) {
  let lastDateLabel = "";

  return (
    <>
      {messages.map((msg, index) => {
        const isMine = msg.senderId === userId;
        const isLast = index === messages.length - 1;
        const currentDateLabel = formatDateLabel(msg.createdAt);

        const showDateDivider = currentDateLabel !== lastDateLabel;
        if (showDateDivider) lastDateLabel = currentDateLabel;

        return (
          <div key={msg._id}>
            {/* ✅ Insère un séparateur de date si changement */}
            {showDateDivider && (
              <div className="flex justify-center my-2">
                <div className="px-4 py-1 text-xs bg-muted rounded-full text-muted-foreground">
                  {currentDateLabel}
                </div>
              </div>
            )}

            <div
              className={`flex mb-2 ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                ref={isLast ? bottomRef : null}
                className={`px-4 py-2 rounded-lg max-w-xs md:max-w-md text-sm break-words ${
                  isMine
                    ? "bg-eventoPurpleDark text-white rounded-br-none"
                    : "bg-muted rounded-bl-none"
                }`}
              >
                {msg.message}
                {msg.createdAt && (
                  <div className="text-[10px] text-right mt-1 opacity-50">
                    {formatTime(msg.createdAt)}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
