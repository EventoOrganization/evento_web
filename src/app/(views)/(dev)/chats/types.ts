import { UserType } from "@/types/UserType";

export type MessageType = {
  _id: string;
  senderId: string; // l’_id de l’expéditeur
  conversationId: string; // l’_id de la conversation (anciennement constantId)
  message: string; // le texte du message
  messageType: string; // ex. "text", "image", etc.
  createdAt: string;
};
export interface ConversationType {
  _id: string;
  participants: UserType[]; // ou un tableau d’objets si tu as populé
  eventId?: string | null;
  title?: string;
  recentMessages?: MessageType[];
  lastMessage?: MessageType | null;
  readReceipts?: {
    [userId: string]: string; // Mapping userId => lastReadMessageId
  };
  unreadCounts?: {
    [userId: string]: number; // Mapping userId => unreadMessagesCount
  };
  // ajoute ici les champs dont tu as besoin…
}
