// type Message<T> = {
//   data: T;
//   id: string;
//   message: string;
// };

export interface Chat extends Record<string, any> {
  id: string;
  title: string;
  createdAt: Date;
  userId: string;
  path: string;
  messages: Message[];
  sharePath?: string;
}
interface SenderID {
  // Define the structure of SenderID if available
}

enum MessageSide {}
// Define the enum values for MessageSide if available

export interface Message {
  id?: string;
  senderID?: SenderID;
  // groupUserIDS?: string[];
  groupID?: string;
  message?: string;
  messageType?: string;
  constantID?: string;
  isRead?: number;
  // groupMessageReadBy?: any[];
  // groupMessageClear?: any[];
  date?: string;
  time?: string;
  createdAt?: string;
  updatedAt?: string;
  v?: number;
  messageSide?: MessageSide;
}
