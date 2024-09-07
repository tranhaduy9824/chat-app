/* eslint-disable @typescript-eslint/no-explicit-any */
interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  text: string;
  mediaUrl: string;
  type: string;
  reactions: array;
  replyTo: string;
  createdAt: string;
}

interface MessageContextProps {
  messages: Message[] | null;
  sendTextMessage: (
    textMessage: string,
    sender: User,
    currentChatId: string
  ) => Promise<void>;
  newMessage: Message[] | null;
  notifications: Message[] | null;
  markAllNotificationsAsRead: any;
  martNotificationAsRead: any;
  markThisUserNotificationsAsRead: any;
}

interface MessageContextProviderProps {
  children: React.ReactNode;
}
