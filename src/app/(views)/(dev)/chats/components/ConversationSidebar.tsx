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
  const filteredConversations = useMemo(
    () =>
      conversations.filter((conv) =>
        (conv.title ?? "").toLowerCase().includes(filter),
      ),
    [conversations, filter],
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
        "w-full max-w-full md:max-w-xs border-r border-muted h-full overflow-y-auto bg-muted",
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
      <ScrollArea className="flex-1 p-4" id="conversation-list">
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
              <div className="text-center text-muted-foreground">
                Aucun utilisateur trouvé
              </div>
            )}
            <hr className="border-t border-muted/50" />
          </>
        )}

        {/* Liste des conversations */}
        {filteredConversations.length > 0 ? (
          <ul className="flex flex-col gap-1">
            {filteredConversations.map((conv) => (
              <li
                key={conv._id}
                className={cn(
                  "rounded-md p-3 cursor-pointer bg-card  hover:bg-evento-gradient-button transition-colors",
                  { "bg-background": isConvSelected },
                )}
                onClick={() => {
                  onSelect(conv);
                  setFilter("");
                }}
              >
                <div className="font-medium">
                  {conv.title ? (
                    <div className="font-medium">{conv.title}</div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {conv.participants
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

                      {conv.participants.filter(
                        (p: UserType) => p._id !== userId,
                      ).length > 4 && (
                        <span className="text-xs text-muted-foreground">
                          +
                          {conv.participants.filter(
                            (p: UserType) => p._id !== userId,
                          ).length - 4}{" "}
                          others
                        </span>
                      )}

                      <span className="ml-2 font-medium truncate">
                        {conv.participants
                          .filter((p: UserType) => p._id !== userId)
                          .map((p: UserType) => p.username)
                          .join(", ")}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {conv.lastMessage || "No message yet"}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          !filter && (
            <div className="p-4 text-center text-muted-foreground">
              Aucune conversation
            </div>
          )
        )}
      </ScrollArea>
    </EzTag>
  );
};
