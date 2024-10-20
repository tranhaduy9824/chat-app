/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { User } from "../types/auth";
import { useLoading } from "./LoadingContext";
import { useNotification } from "./NotificationContext";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext<ChatContextProps | undefined>(
  undefined
);

export const ChatContextProvider: React.FC<ChatContextProviderProps> = ({
  children,
  user,
}) => {
  const [userChats, setUserChats] = useState<Chat[] | null>(null);
  const [potentialChats, setPotentialChats] = useState<User[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [mutedChats, setMutedChats] = useState<string[]>(() => {
    const storedMutedChats = localStorage.getItem("mutedChats");
    return storedMutedChats ? JSON.parse(storedMutedChats) : [];
  });
  const [pinnedMessages, setPinnedMessages] = useState<any[]>([]);

  const { setProgress } = useLoading();
  const { addNotification } = useNotification();

  const { socket } = useContext(AuthContext)!;

  useEffect(() => {
    if (socket === null || !user?._id) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res: any) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket, user]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`, setProgress, true);

      if (response.error) {
        return console.log("Error fetching users", response);
      }

      const pChats = response.filter((u: User) => {
        let isChatCreated = false;

        if (user?._id === u._id) return false;

        if (userChats) {
          isChatCreated = userChats.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }
        return !isChatCreated;
      });

      setPotentialChats(pChats);
      setAllUsers(response);
    };

    getUsers();
  }, [user]);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        const response = await getRequest(
          `${baseUrl}/chats/${user?._id}`,
          setProgress,
          true
        );

        if (response.error) {
          return addNotification(response.messsage, "error");
        }

        setUserChats(response);
      }
    };

    getUserChats();
  }, [user]);

  const updateCurrentChat = useCallback((chat: Chat | null) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(
    async (firstId: string, secondId: string) => {
      try {
        const newMembersString = [firstId, secondId].sort().join(",");

        const existingChat = userChats?.find(
          (chat) => chat.members.sort().join(",") === newMembersString
        );

        if (existingChat) {
          updateCurrentChat(existingChat);
          return;
        }

        const response = await postRequest(
          `${baseUrl}/chats`,
          {
            firstId,
            secondId,
          },
          undefined,
          true
        );

        if (response.error) {
          console.log("Error creating chat", response);
          return;
        }

        setUserChats((prev) => [response, ...(prev || [])]);

        updateCurrentChat(response);
      } catch (error) {
        console.log("Error creating chat", error);
      }
    },
    [userChats, updateCurrentChat]
  );

  useEffect(() => {
    updateCurrentChat(null);
  }, [user]);

  const toggleMuteChat = useCallback((chatId: string) => {
    setMutedChats((prev) => {
      let updatedMutedChats;
      if (prev.includes(chatId)) {
        updatedMutedChats = prev.filter((id) => id !== chatId);
      } else {
        updatedMutedChats = [...prev, chatId];
      }
      localStorage.setItem("mutedChats", JSON.stringify(updatedMutedChats));
      return updatedMutedChats;
    });
  }, []);

  const isChatMuted = useCallback(
    (chatId: string) => {
      return mutedChats.includes(chatId);
    },
    [mutedChats]
  );

  const pinMessage = useCallback(
    async (messageId: string) => {
      if (socket) {
        socket.emit("pinMessage", {
          messageId,
          members: currentChat?.members,
        });
      }

      const response = await postRequest(
        `${baseUrl}/chats/${currentChat?._id}/pinMessage`,
        { messageId },
        undefined,
        true
      );

      if (response.error) {
        return addNotification(response.message, "error");
      }
    },
    [currentChat, socket, addNotification, setPinnedMessages]
  );

  const unpinMessage = useCallback(
    async (messageId: string) => {
      if (socket) {
        socket.emit("unpinMessage", {
          messageId,
          members: currentChat?.members,
        });
      }

      const response = await postRequest(
        `${baseUrl}/chats/${currentChat?._id}/unpinMessage`,
        { messageId },
        undefined,
        true
      );

      if (response.error) {
        return addNotification(response.message, "error");
      }
    },
    [currentChat, socket, addNotification, setPinnedMessages]
  );

  const getPinnedMessages = useCallback(async () => {
    if (currentChat) {
      const response = await getRequest(
        `${baseUrl}/chats/${currentChat._id}/pinnedMessages`,
        undefined,
        true
      );

      if (response.error) {
        return addNotification(response.message, "error");
      }

      setPinnedMessages(response);
    }
  }, [currentChat, addNotification, setPinnedMessages]);

  useEffect(() => {
    if (currentChat) {
      getPinnedMessages();
    }
  }, [currentChat, getPinnedMessages]);

  const updateNickname = useCallback(
    async (chatId: string, userId: string, nickname: string) => {
      const response = await postRequest(
        `${baseUrl}/chats/${chatId}/updateNickname`,
        { userId, nickname },
        undefined,
        true
      );

      socket.emit("changeNickname", {
        chatId: currentChat?._id,
        userId,
        newNickname: nickname,
        members: currentChat?.members,
      });

      if (response.error) {
        return addNotification(response.message, "error");
      }
    },
    [addNotification, currentChat]
  );

  return (
    <ChatContext.Provider
      value={{
        userChats,
        potentialChats,
        createChat,
        currentChat,
        updateCurrentChat,
        allUsers,
        onlineUsers,
        socket,
        setCurrentChat,
        toggleMuteChat,
        isChatMuted,
        pinMessage,
        unpinMessage,
        getPinnedMessages,
        pinnedMessages,
        setPinnedMessages,
        updateNickname,
        setUserChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
