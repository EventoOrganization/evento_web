"use client";

import { useSession } from "@/contexts/(prod)/SessionProvider";
import { formatTime } from "@/utils/formatTime";
import { isMessageReadBy } from "../functions/isMessageReadBy";
import { ConversationType, MessageType } from "../types";
import { formatDateLabel } from "../utils/formatDateLabel";

interface MessagesListProps {
  conv: ConversationType | null;
  messages: MessageType[];
  userId: string | undefined;
  bottomRef: React.RefObject<HTMLDivElement>;
}

export function MessagesList({
  conv,
  messages,
  userId,
  bottomRef,
}: MessagesListProps) {
  let lastDateLabel = "";
  const { user } = useSession();

  if (!conv) return <></>;

  const otherParticipantIds = conv.participants
    .filter((p) => p._id !== user?._id)
    .map((u) => u._id);

  return (
    <>
      {messages.map((msg, index) => {
        const isMine = msg.senderId === userId;
        const isLast = index === messages.length - 1;
        const currentDateLabel = formatDateLabel(msg.createdAt);

        const seenBy = otherParticipantIds.filter((otherId) =>
          isMessageReadBy(conv, otherId, msg._id),
        );

        const showDateDivider = currentDateLabel !== lastDateLabel;
        if (showDateDivider) lastDateLabel = currentDateLabel;

        return (
          <div key={msg._id}>
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
                className={`relative px-4 py-2 rounded-lg max-w-xs md:max-w-md text-sm break-words ${
                  isMine
                    ? "bg-eventoPurpleDark text-white rounded-br-none"
                    : "bg-muted rounded-bl-none"
                }`}
              >
                {msg.message}
                {msg.createdAt && (
                  <div className="text-[10px] text-right mt-1 opacity-50 flex items-center gap-1">
                    {formatTime(msg.createdAt)}

                    {/* ✅ Affiche si c'est ton propre message */}
                    {isMine && seenBy.length > 0 && (
                      <div className="flex items-center ml-1">
                        {seenBy.length === 1 ? (
                          <span>✅</span> // simple double check
                        ) : (
                          <div className="flex -space-x-1">
                            {seenBy.slice(0, 3).map((userId, idx) => (
                              <div
                                key={idx}
                                className="w-3 h-3 rounded-full border-2 border-white bg-gray-300"
                                title={userId}
                              />
                            ))}
                            {seenBy.length > 3 && (
                              <div className="w-3 h-3 rounded-full bg-gray-400 text-[8px] flex items-center justify-center">
                                +{seenBy.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
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
