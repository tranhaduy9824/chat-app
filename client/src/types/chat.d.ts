/* eslint-disable @typescript-eslint/no-explicit-any */
interface Chat {
  secondId: any;
  firstId: any;
  _id: string;
  members: string[];
  notificationsEnabled: Map<string, boolean>;
}

interface ChatContextProps {
  userChats: Chat[] | null;
  potentialChats: User[];
  createChat: (firstId: string, secondId: string) => Promise<void>;
  currentChat: Chat | null;
  updateCurrentChat: (chat: Chat) => void;
  allUsers: User[];
  onlineUsers: User[];
  socket: Socket;
  setCurrentChat: (chat: Chat | null) => void;
  toggleMuteChat: (chatId: string) => void;
  isChatMuted: (chatId: string) => boolean;
}

interface ChatContextProviderProps {
  children: React.ReactNode;
  user: User | null;
}
