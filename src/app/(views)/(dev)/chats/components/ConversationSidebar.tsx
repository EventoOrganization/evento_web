"use client";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { cn } from "@/lib/utils";
import { useUsersStore } from "@/store/useUsersStore";
import { UserType } from "@/types/UserType";
import EzTag from "@ezstart/ez-tag";
import { useMemo, useState } from "react";
import { useSocket } from "../contexts/SocketProvider";
import { ConversationListItem } from "./ConversationListItem";

export const ConversationSidebar = ({
  isConvSelected,
  onSelect,
}: {
  isConvSelected: boolean;
  onSelect: (conv: any) => void;
}) => {
  const { user } = useSession();
  const { users } = useUsersStore();
  const { conversations } = useSocket();
  const [filter, setFilter] = useState<string>("");
  const userId = user?._id;

  // 2. Filtrer les conversations (par titre)
  const filteredConversations = conversations.filter((conv) =>
    (conv.title ?? "").toLowerCase().includes(filter),
  );

  // 3. Filtrer directement les utilisateurs (éviter ceux déjà en 1-1)
  const filteredUsers = useMemo(() => {
    if (filter.length <= 2) return [];

    return users.filter((u) => {
      const alreadyInOneOnOne = conversations.some(
        (conv) =>
          conv.participants.length === 2 &&
          conv.participants.some((p: UserType) => p._id === u._id),
      );

      return !alreadyInOneOnOne && u.username.toLowerCase().includes(filter);
    });
  }, [users, conversations, filter]);

  return (
    <EzTag
      as="aside"
      className={cn(
        "w-full max-w-full md:max-w-xs border-r border-muted h-full overflow-y-auto bg-muted p-0",
        "flex flex-col h-full",
        { "hidden md:block": isConvSelected },
      )}
    >
      <EzTag as="div" className="p-4">
        <Input
          type="text"
          placeholder="Search conversations or users…"
          value={filter}
          onChange={(e) => setFilter(e.target.value.toLowerCase())}
        />
      </EzTag>
      <ScrollArea className="flex-1 px-4" id="conversation-list">
        {/* Si on a un filtre non vide, on affiche d'abord les utilisateurs */}
        {filter && (
          <>
            {filteredUsers.length > 0 ? (
              <ul className="flex flex-col gap-1">
                <EzTag key={"select"} as="p">
                  Select to start chat
                </EzTag>
                {filteredUsers.map((u) => (
                  <li
                    key={u._id}
                    className="p-2 flex items-center cursor-pointer bg-card rounded-md hover:bg-evento-gradient-button transition-colors"
                    onClick={() => {
                      userId &&
                        onSelect({
                          participants: [userId, u._id],
                        });
                      setFilter("");
                    }}
                  >
                    <EzTag
                      as="img"
                      src={u.profileImage || "/evento-logo.png"}
                      alt={u.username}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-4">
                      <p>{u.username}</p>
                      <p className="text-xs">
                        {u.firstName} {u.lastName}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EzTag as="p" className="text-center text-muted-foreground">
                No users found
              </EzTag>
            )}
            <hr className="border-t border-muted/50" />
          </>
        )}

        {/* Liste des conversations */}
        {filteredConversations.length > 0 ? (
          <ul className="flex flex-col gap-1">
            {filteredConversations.map((conv) => (
              <ConversationListItem
                key={conv._id}
                conversation={conv}
                isSelected={isConvSelected}
                onSelect={(conv) => {
                  onSelect(conv);
                  setFilter("");
                }}
              />
            ))}
          </ul>
        ) : (
          !filter && (
            <EzTag as="p" className="p-4 text-center text-muted-foreground">
              No conversation yet, start a new one from input above
            </EzTag>
          )
        )}
      </ScrollArea>
    </EzTag>
  );
};
