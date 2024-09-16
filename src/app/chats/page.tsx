"use client";

import Burger from "@/components/Burger";
import { Input } from "@/components/ui/input";
import { useSession } from "@/contexts/SessionProvider";
import ChatInput from "@/features/chat/components/ChatInput";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { EventType } from "@/types/EventType";
import moment from "moment";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
type MessageType = {
  _id: string;
  senderId: string;
  message: string;
  receiverId: string;
  timestamp: string;
  message_type: number;
  lastmessage?: { message: string; timestamp: string };
};

const ChatPage = () => {
  const [conversations, setConversations] = useState<
    (EventType | MessageType)[]
  >([]);
  const [filteredConversations, setFilteredConversations] = useState<
    (EventType | MessageType)[]
  >([]);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [selectedReceiverId, setSelectedReceiverId] = useState<
    string | undefined
  >(undefined);
  const { token } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [messageType, setMessageType] = useState(1);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const privateResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/chats/privateConversations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const privateData = await privateResponse.json();

        const eventResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/chats/myEventsWithChat`,
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const eventData = await eventResponse.json();

        if (privateData.status && eventData.status) {
          // Fusionner les conversations privées et les événements
          const mergedConversations = [
            ...privateData.conversations,
            ...eventData.events,
          ];

          // Trier par last message, sinon par titre alphabétique
          const sortedConversations = mergedConversations.sort((a, b) => {
            const aLastMessage =
              a?.lastmessage?.timestamp || a?.details?.title || "";
            const bLastMessage =
              b?.lastmessage?.timestamp || b?.details?.title || "";

            // If both have timestamps, compare them
            if (aLastMessage && bLastMessage) {
              return (
                new Date(bLastMessage).getTime() -
                new Date(aLastMessage).getTime()
              );
            }

            // If timestamps are not available or the same, compare titles or usernames
            return (a?.details?.title || a?.username || "").localeCompare(
              b?.details?.title || b?.username || "",
            );
          });

          setConversations(sortedConversations);
          setFilteredConversations(sortedConversations);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, [token]);

  // Function to handle selecting a conversation

  const sendMessage = async () => {
    const formData = new FormData();
    formData.append("senderId", user?._id ?? "");
    formData.append("eventId", selectedEvent?._id ?? "");
    formData.append("receiverId", selectedReceiverId ?? "");
    formData.append("message_type", String(messageType)); // Convertir le numéro en chaîne

    if (file) {
      formData.append("file", file);
    }
    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chats/saveMessage`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );
      const data = await response.json();
      if (response.ok) {
        setMessages((prev) => [...prev, data.message]);
        setFile(null);
        setMessageType(1);
      } else {
        console.error("Failed to send message:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSelectConversation = (conversation: EventType | MessageType) => {
    setSelectedEvent(conversation as EventType);

    // Gestion des événements et des conversations privées
    const receiverId = (conversation as MessageType)?.receiverId || "";
    setSelectedReceiverId(receiverId);

    socketRef.current?.emit("joinRoom", conversation?._id);
    setMessages([]); // Clear messages when a new event is selected
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setFilteredConversations(
      conversations.filter((conversation) => {
        const title =
          (conversation as EventType)?.title ||
          (conversation as MessageType)?.lastmessage?.message;
        return title?.toLowerCase().includes(searchTerm);
      }),
    );
  };

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("send_message_emit", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("send_message_emit");
      }
    };
  }, [socketRef.current]);

  return (
    <div className="h-screen w-screen fixed inset-0 pb-11 md:pb-0">
      <div className="flex w-full h-full ">
        <div
          className={cn(
            "md:flex transition-all md:opacity-100 md:translate-x-0 duration-300 md:w-1/4 md:min-w-60 border-r h-full  flex-col",
            {
              "translate-x-[-100%] w-0 opacity-0": !isOpen,
              "translate-x-0 w-full opacity-100": isOpen || !selectedEvent,
            },
          )}
        >
          <div className="p-4 border-b">
            <Input
              type="text"
              placeholder="Search or start new chat"
              onChange={handleFilterChange}
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <p className="text-gray-600 p-4">
                No events or conversations available.
              </p>
            ) : (
              <ul className="p-2 space-y-2">
                {filteredConversations.map((conversation, index) => (
                  <li
                    key={index}
                    className="flex items-center w-full bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      handleSelectConversation(conversation);
                      setIsOpen(false);
                    }}
                  >
                    <div className="relative min-w-12 h-12 mr-4">
                      <Image
                        src={
                          (conversation as EventType).initialMedia?.length > 0
                            ? (conversation as EventType)?.initialMedia[0]?.url
                            : "/defaultImage.png"
                        }
                        alt={
                          (conversation as EventType).title || "Conversation"
                        }
                        className="rounded-full"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-semibold text-lg truncate">
                        {(conversation as EventType).title ||
                          (conversation as MessageType).lastmessage?.message}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {moment(
                          (conversation as MessageType)?.lastmessage
                            ?.timestamp || new Date(),
                        ).format("HH:mm A")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div
          className={cn(
            "md:w-3/4 w-full transition-all duration-300 flex flex-col h-full",
            {
              "w-0 opacity-0": isOpen,
              hidden: !selectedEvent,
            },
          )}
        >
          {selectedEvent ? (
            <>
              <div className="p-4 bg-evento-gradient flex justify-between text-white border-b">
                <h2 className="text-xl font-semibold py-1.5 truncate">
                  {selectedEvent.title}
                </h2>
                <Burger
                  setIsOpen={setIsOpen}
                  isOpen={isOpen}
                  className="flex md:hidden"
                />
              </div>
              <div className="flex-1 overflow-y-auto p-4 bg-white">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-2 p-2 max-w-xs ${msg.senderId === user?._id ? "bg-green-200 ml-auto text-right" : "bg-gray-200 mr-auto text-left"} rounded-lg`}
                  >
                    {msg.message_type === 1 ? (
                      <p>{msg.message}</p>
                    ) : msg.message_type === 2 ? (
                      <Image
                        src={msg.message}
                        alt="Image"
                        width={200}
                        height={200}
                      />
                    ) : msg.message_type === 3 ? (
                      <video src={msg.message} controls width="300" />
                    ) : null}
                    <span className="block text-xs text-gray-500">
                      {moment(msg.timestamp).format("HH:mm A")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-5 border-t flex gap-6 items-center">
                <ChatInput onSendMessage={sendMessage} />
              </div>
            </>
          ) : (
            <div className="flex-1 p-6 bg-white flex items-center justify-center">
              <p className="text-gray-600">Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
