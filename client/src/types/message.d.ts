interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  text: string;
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
}

interface MessageContextProviderProps {
  children: React.ReactNode;
}
