"use client";

import Burger from "@/components/Burger";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/contexts/SessionProvider";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { EventType } from "@/types/EventType";
import moment from "moment";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
type MessageType = {
  senderId: string;
  message: string;
  timestamp: string;
};
const ChatPage = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventType[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [input, setInput] = useState("");
  const { token } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const user = useAuthStore((state) => state.user);
  console.log(user);

  useEffect(() => {
    // Establish the socket connection once
    if (!socketRef.current) {
      socketRef.current = io(`${process.env.NEXT_PUBLIC_API_URL}`);

      socketRef.current.on("connect", () => {
        console.log("Connected to socket server");
      });

      socketRef.current.on("message", (message) => {
        console.log("Message received:", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    return () => {
      // Cleanup the socket connection on unmount
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/chats/myEventsWithChat`,
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        const eventsWithChat = data.events.filter(
          (event: EventType) => event?.details?.includeChat,
        );
        setEvents(eventsWithChat);
        setFilteredEvents(eventsWithChat);
      } catch (error) {
        console.error("Error fetching user events:", error);
      }
    };

    fetchUserEvents();
  }, []);

  // Function to handle selecting an event to chat
  const handleSelectEvent = (event: EventType) => {
    setSelectedEvent(event);
    socketRef.current?.emit("joinRoom", event._id);
    setMessages([]); // Clear messages when a new event is selected
  };

  const sendMessage = async () => {
    if (input.trim()) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/saveMessage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              eventId: selectedEvent?._id || null,
              senderId: user?._id,
              message: input,
              message_type: 1,
            }),
          },
        );

        if (response.ok) {
          const data = await response.json();
          setMessages((prevMessages) => [...prevMessages, data.message]);
        } else {
          console.error("Failed to send message:", response.statusText);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }

      setInput("");
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setFilteredEvents(
      events.filter((event) => event.title.toLowerCase().includes(searchTerm)),
    );
  };
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
            {filteredEvents.length === 0 ? (
              <p className="text-gray-600 p-4">
                No events with active chat available.
              </p>
            ) : (
              <ul className="p-2 space-y-2">
                {filteredEvents.map((event) => (
                  <li
                    key={event._id}
                    className="flex items-center w-full bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      handleSelectEvent(event);
                      setIsOpen(false);
                    }}
                  >
                    <div className="relative min-w-12 h-12 mr-4">
                      <Image
                        src={
                          event.initialMedia.length > 0
                            ? event.initialMedia[0].url
                            : "/defaultImage.png"
                        }
                        alt={event.title}
                        layout="fill"
                        className="rounded-full"
                        objectFit="cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-semibold text-lg truncate">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        Last message - {moment(event.date).format("HH:mm A")}
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
                    className={`mb-2 p-2 max-w-xs ${
                      msg.senderId === user?._id
                        ? "bg-green-200 ml-auto text-right"
                        : "bg-gray-200 mr-auto text-left"
                    } rounded-lg`}
                  >
                    {msg.message}{" "}
                    {/* Affichage de msg.message à la place de msg */}
                    <span className="block text-xs text-gray-500">
                      {moment(msg.timestamp).format("HH:mm A")}{" "}
                      {/* Ajout du timestamp formaté */}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-5 border-t flex gap-6 items-center">
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                />
                <Button
                  onClick={sendMessage}
                  className="bg-evento-gradient hover:opacity-80"
                >
                  Send
                </Button>
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
