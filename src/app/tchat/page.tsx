"use client";

import { isUserLoggedInCSR } from "@/features/event/eventActions";
import { useAuthStore } from "@/store/useAuthStore";
import { Event } from "@/types/EventType";
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

const ChatPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [input, setInput] = useState("");
  const token = isUserLoggedInCSR();
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
    // Fetch events with active chat
    const fetchUserEvents = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/myEventsWithChat`,
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        // Filter events that have active chat
        const eventsWithChat = data.events.filter(
          (event: Event) => event?.details?.includeChat,
        );
        setEvents(eventsWithChat);
      } catch (error) {
        console.error("Error fetching user events:", error);
      }
    };

    fetchUserEvents();
  }, []);

  // Function to handle selecting an event to chat
  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    socketRef.current?.emit("joinRoom", event._id);
    setMessages([]); // Clear messages when a new event is selected
  };

  const sendMessage = async () => {
    if (input.trim()) {
      console.log("Sending message:", user?.userInfo?._id);
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
              senderId: user?.userInfo?._id,
              message: input,
              message_type: 1,
            }),
          },
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Message saved:", data);
          setMessages((prevMessages) => [...prevMessages, data.message]); // Ajouter le message localement
        } else {
          console.error("Failed to send message:", response.statusText);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }

      setInput(""); // Clear the input field after sending
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Chat Rooms</h1>
      {events.length === 0 ? (
        <p className="text-gray-600">No events with active chat available.</p>
      ) : (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Select an event to chat:
          </h2>
          <ul className="space-y-2">
            {events.map((event) => (
              <li key={event._id}>
                <button
                  onClick={() => handleSelectEvent(event)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {event.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedEvent && (
        <div className="bg-evento-gradient p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Chat Room: {selectedEvent.title}
          </h2>
          <div className="mb-4 h-64 overflow-y-auto p-4 bg-white text-black rounded-lg shadow-inner">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2 p-2 bg-gray-200 rounded-lg">
                {msg}
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow p-2 border rounded-lg"
            />
            <button
              onClick={sendMessage}
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
