/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useContext,
} from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { useNotification } from "./NotificationContext";
import { ChatContext } from "./ChatContext";
import { User } from "../types/auth";
import { AuthContext } from "./AuthContext";

export const MessageContext = createContext<MessageContextProps | undefined>(
  undefined
);

export const MessageContextProvider: React.FC<MessageContextProviderProps> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [newMessage, setNewMessage] = useState<Message[] | null>(null);
  const [notifications, setNotifications] = useState<Message[] | null>(null);

  const { currentChat, socket } = useContext(ChatContext)!;
  const { user } = useContext(AuthContext)!;

  const { addNotification } = useNotification();

  useEffect(() => {
    const getMessages = async () => {
      const response = await getRequest(
        `${baseUrl}/messages/${currentChat?._id}`
      );

      if (response.error) {
        return addNotification(response.message, "error");
      }

      setMessages(response);
    };

    getMessages();
  }, [currentChat]);

  useEffect(() => {
    if (socket === null) return;

    const recipientId = currentChat?.members?.find((id) => id !== user?._id);

    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res: Message) => {
      if (currentChat?._id !== res.chatId) return;

      setMessages((prev) => [...(prev || []), res]);
    });

    socket.on("getNotifications", (res: Message) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);

      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...(prev || [])]);
      } else {
        setNotifications((prev) => [res, ...(prev || [])]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotifications");
    };
  }, [socket, currentChat]);

  const sendTextMessage = useCallback(
    async (textMessage: string, sender: User, currentChatId: string) => {
      if (!textMessage) return console.log("You must type something...");

      const response = await postRequest(`${baseUrl}/messages`, {
        chatId: currentChatId,
        senderId: sender._id,
        text: textMessage,
      });

      if (response.error) {
        return addNotification(response.message, "error");
      }

      setNewMessage(response);
      setMessages((prev) => [...(prev || []), response]);
    },
    []
  );

  return (
    <MessageContext.Provider
      value={{
        messages,
        sendTextMessage,
        newMessage,
        notifications,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
