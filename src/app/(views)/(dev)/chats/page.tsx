"use client";

import AuthModal from "@/components/system/auth/AuthModal";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { UserType } from "@/types/UserType";
import EzTag from "@ezstart/ez-tag";
import { useState } from "react";
import { ChatHeader } from "./components/ChatHeader";
import ChatInput from "./components/ChatInput";
import ChatMessages from "./components/ChatMessages";
import ConversationManager from "./components/ConversationManager";
import { ConversationSidebar } from "./components/ConversationSidebar";
import { useCreateConversation } from "./hooks/useCreateConversation";
import { ConversationType } from "./types";

export default function ChatPage() {
  const { user } = useSession();
  const userId = user?._id;
  const [activeConversation, setActiveConversation] =
    useState<ConversationType | null>(null);
  const createConversation = useCreateConversation();
  const { toast } = useToast();
  const handleSelect = async (convOrData: any) => {
    // 1) Si c'est déjà une conversation (avec un _id)...
    if (convOrData._id) {
      console.log("Conversation selected:", convOrData);
      setActiveConversation(convOrData);
      return;
    }

    // 2) Sinon on suppose qu'on a { participants: [...], event?: ... }
    try {
      const newConv = await createConversation(
        convOrData.participants,
        convOrData.event || null,
      );
      setActiveConversation(newConv);
      console.log("Conversation created:", newConv);
      toast({
        title: "Conversation created",
        description: "You have successfully created a conversation",
        variant: "evento",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };
  return (
    <>
      <ChatHeader
        isConvSelected={!!activeConversation}
        onBack={() => setActiveConversation(null)}
      />

      <EzTag as="div" className="flex h-full pb-16">
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
                            className="w-6 h-6 rounded-full"
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
