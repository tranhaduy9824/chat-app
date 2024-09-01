interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

interface Chat {
  _id: string;
  members: string[];
}

interface User {
  _id: string;
  fullname: string;
  avatar: string;
  email: string;
}

interface MessageContextProps {
  messages: Message[] | null;
  sendTextMessage: (
    textMessage: string,
    sender: User,
    currentChatId: string,
    setTextMessage: React.Dispatch<React.SetStateAction<string>>
  ) => Promise<void>;
}
