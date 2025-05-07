"use client";

import AuthModal from "@/components/system/auth/AuthModal";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { cn } from "@/lib/utils";
import { UserType } from "@/types/UserType";
import EzTag from "@ezstart/ez-tag";
import { usePathname } from "next/navigation";
import { ChatHeader } from "./components/ChatHeader";
import ChatInput from "./components/ChatInput";
import ChatMessages from "./components/ChatMessages";
import ConversationManager from "./components/ConversationManager";
import { ConversationSidebar } from "./components/ConversationSidebar";
import { useSocket } from "./contexts/SocketProvider";
import { useCreateConversation } from "./hooks/useCreateConversation";

export default function ChatPage() {
  const pathname = usePathname();
  const { user } = useSession();
  const userId = user?._id;
  const { activeConversation, setActiveConversation } = useSocket();
  const isChatView = pathname.startsWith("/chat");
  const createConversation = useCreateConversation();
  const handleSelect = async (convOrData: any) => {
    if (convOrData._id) {
      console.log("Conversation selected:", convOrData);
      setActiveConversation(convOrData);
      return;
    }
    const newConv = await createConversation(
      convOrData.participants,
      convOrData.event || null,
    );
    setActiveConversation(newConv);
  };
  return (
    <>
      <ChatHeader
        isConvSelected={!!activeConversation}
        onBack={() => setActiveConversation(null)}
      />

      <EzTag
        as="div"
        className={cn("flex h-full ", {
          "pb-0 md:pb-16": isChatView && activeConversation,
        })}
      >
        {/* Sidebar */}
        <ConversationSidebar
          isConvSelected={!!activeConversation}
          onSelect={handleSelect}
        />

        {/* Zone de chat ou placeholder */}
        <EzTag
          as="div"
          className={cn("flex-1 flex flex-col h-full bg-background", {
            "hidden md:flex": !activeConversation,
          })}
        >
          {!activeConversation ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a conversation
            </div>
          ) : (
            <>
              {/* Header de la conversation */}
              <EzTag
                as="div"
                className="bg-muted p-4 border-b flex items-center justify-between"
              >
                <h2>
                  {" "}
                  {activeConversation.title ? (
                    <div className="font-medium">
                      {activeConversation.title}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {activeConversation.participants
                        .filter((p: UserType) => p._id !== userId)
                        .slice(0, 4) // 4 images max
                        .map((p: UserType) => (
                          <img
                            key={p._id}
                            src={p.profileImage || "/evento-logo.png"}
                            alt={p.username}
                            className="w-10 h-10 rounded-full"
                          />
                        ))}

                      {activeConversation.participants.filter(
                        (p: UserType) => p._id !== userId,
                      ).length > 4 && (
                        <span className="text-xs text-muted-foreground">
                          +
                          {activeConversation.participants.filter(
                            (p: UserType) => p._id !== userId,
                          ).length - 4}{" "}
                          others
                        </span>
                      )}

                      <span className="ml-2 font-medium truncate">
                        {activeConversation.participants
                          .filter((p: UserType) => p._id !== userId)
                          .map((p: UserType) => p.username)
                          .join(", ")}
                      </span>
                    </div>
                  )}
                </h2>
                <ConversationManager
                  conversation={activeConversation}
                  onConversationEnded={() => setActiveConversation(null)}
                />
              </EzTag>

              {/* Messages */}
              <ChatMessages activeConversation={activeConversation} />

              {/* Input */}
              <ChatInput conversationId={activeConversation._id} />
            </>
          )}
        </EzTag>
      </EzTag>
      {!user && <AuthModal onAuthSuccess={() => {}} defaultForm="login" />}
    </>
  );
}
