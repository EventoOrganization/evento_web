import { UserType } from "@/types/UserType";

export type MessageType = {
  _id: string;
  senderId: string;
  clientId?: string;
  conversationId: string;
  message: string;
  messageType: string;
  createdAt: string;
  pending: boolean;
};
export interface ConversationType {
  _id: string;
  participants: UserType[];
  eventId?: string | null;
  title?: string;
  recentMessages?: MessageType[];
  lastMessage?: MessageType | null;
  readReceipts?: {
    [userId: string]: string;
  };
  unreadCounts?: {
    [userId: string]: number;
  };
}
