"use client";

import { useSocket } from "@/app/(views)/(dev)/chats/contexts/SocketProvider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/togglerbtn";
import { useEffect, useState } from "react";

export function PresenceSwitcher() {
  const { socket } = useSocket();
  // état local de ton statut « apparaitre en ligne »
  const [appearOnline, setAppearOnline] = useState(true);

  // à chaque toggle, on prévient le serveur
  const toggleOnline: () => void = () => {
    const next = !appearOnline;
    setAppearOnline(next);
    socket?.emit("user_presence_update", {
      status: next ? "online" : "offline",
    });
  };

  useEffect(() => {
    console.log("socket", socket);
    if (socket) {
      socket.emit("user_presence_update", {
        status: appearOnline ? "online" : "offline",
      });
    }
  }, [socket, appearOnline]);

  return (
    <Label className="inline-flex items-center cursor-pointer select-none gap-2">
      <Input
        type="checkbox"
        className="sr-only peer"
        checked={appearOnline}
        onChange={toggleOnline}
      />
      <Switch onCheckedChange={toggleOnline} checked={appearOnline} />
      {appearOnline ? "Online" : "Offline"}
    </Label>
  );
}
