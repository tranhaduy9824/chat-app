/* eslint-disable @typescript-eslint/no-explicit-any */
interface Chat {
  secondId: any;
  firstId: any;
  _id: string;
  members: string[];
  notificationsEnabled: Map<string, boolean>;
  nicknames: any[];
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
  setCurrentChat: any;
  toggleMuteChat: (chatId: string) => void;
  isChatMuted: (chatId: string) => boolean;
  pinMessage: (messageId: string) => void;
  unpinMessage: (messageId: string) => void;
  getPinnedMessages: () => void;
  pinnedMessages: Message[];
  setPinnedMessages: (messages: any) => void;
  updateNickname: (chatId: string, userId: string, nickname: string) => void;
  setUserChats: (chats: Chat[]) => void;
}

interface ChatContextProviderProps {
  children: React.ReactNode;
  user: User | null;
}
