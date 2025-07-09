"use client";

import { MessagesList } from "../components/MessagesList";
import { useChatMessages } from "../hooks/useChatMessages";
import { ConversationType } from "../types";

interface ChatMessagesProps {
  activeConversation: ConversationType | null;
}

export default function ChatMessages({
  activeConversation,
}: ChatMessagesProps) {
  const { messages, user, loadOlderMessages, noMoreMessages, bottomRef } =
    useChatMessages(activeConversation);

  return (
    <div
      onScroll={(e) => {
        if (noMoreMessages) return;
        if (e.currentTarget.scrollTop === 0) {
          loadOlderMessages();
        }
      }}
      className="flex flex-col overflow-y-auto px-4 py-2 space-y-4 text-xs"
    >
      {noMoreMessages && (
        <p className="text-center text-muted-foreground text-xs mb-4">
          No more messages
        </p>
      )}
      <MessagesList
        messages={messages}
        userId={user?._id}
        bottomRef={bottomRef}
        conv={activeConversation}
      />
    </div>
  );
}
