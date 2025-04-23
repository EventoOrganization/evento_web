export type MessageType = {
  _id: string;
  senderId: string;
  receiverId: string; // userId or eventId
  text: string;
  createdAt: string;
};
