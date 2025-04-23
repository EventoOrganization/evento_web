"use client";

export const ChatInput = () => (
  <div className="p-4 border-t">
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 border px-4 py-2 rounded-lg text-sm"
      />
      <button className="bg-evento-gradient text-white px-4 py-2 rounded-lg text-sm">
        Send
      </button>
    </div>
  </div>
);
