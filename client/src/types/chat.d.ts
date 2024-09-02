/* eslint-disable @typescript-eslint/no-explicit-any */
interface Chat {
  secondId: any;
  firstId: any;
  _id: string;
  members: string[];
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
}

interface ChatContextProviderProps {
  children: React.ReactNode;
  user: User | null;
}
