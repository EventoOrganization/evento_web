"use client";

import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, isAuthenticated, isTokenChecked } = useSession();
  const { toast } = useToast();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 1) On n’essaie de se connecter qu’après validation du token
    if (!isTokenChecked || !isAuthenticated || !token) {
      // Si l’utilisateur s’est déconnecté, on nettoie la socket
      socket?.disconnect();
      setSocket(null);
      setIsConnected(false);
      return;
    }

    // 2) Maintenant que le token est validé, on peut se connecter
    const sock = io(process.env.NEXT_PUBLIC_API_URL!, {
      transports: ["websocket"],
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    sock.on("connect", () => {
      console.log("[Socket] connected", sock.id);
      setSocket(sock);
      setIsConnected(true);
    });

    sock.on("disconnect", (reason) => {
      console.warn("[Socket] disconnected:", reason);
      setSocket(null);
      setIsConnected(false);
    });

    sock.on("connect_error", (err) => {
      console.error("[Socket] connection error:", err.message);
      toast({
        title: "Socket error",
        description: err.message,
        variant: "destructive",
      });
    });

    // Nettoyage quand token change ou quand on se déconnecte
    return () => {
      sock.off("connect");
      sock.off("disconnect");
      sock.off("connect_error");
      sock.disconnect();
    };
  }, [isTokenChecked, isAuthenticated, token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
