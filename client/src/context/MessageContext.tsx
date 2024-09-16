/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useContext,
} from "react";
import {
  baseUrl,
  getRequest,
  patchRequest,
  postRequest,
} from "../utils/services";
import { useNotification } from "./NotificationContext";
import { ChatContext } from "./ChatContext";
import { User } from "../types/auth";
import { AuthContext } from "./AuthContext";
import { useLoading } from "./LoadingContext";

export const MessageContext = createContext<MessageContextProps | undefined>(
  undefined
);

export const MessageContextProvider: React.FC<MessageContextProviderProps> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [newMessage, setNewMessage] = useState<Message[] | null>(null);
  const [notifications, setNotifications] = useState<Message[] | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const { currentChat, socket, updateCurrentChat } = useContext(ChatContext)!;
  const { user } = useContext(AuthContext)!;
  const { setProgress } = useLoading();

  const { addNotification } = useNotification();

  const getMessages = useCallback(
    async (page: number, limit: number) => {
      const response = await getRequest(
        `${baseUrl}/messages/${currentChat?._id}?page=${page}&limit=${limit}`,
        undefined,
        true
      );

      if (response.error) {
        return addNotification(response.message, "error");
      }

      setMessages((prevMessages) => [
        ...(prevMessages ?? []),
        ...response.messages,
      ]);
      setHasMore(response.hasMore);
    },
    [currentChat, addNotification]
  );

  useEffect(() => {
    setMessages([]);
  }, [currentChat]);

  useEffect(() => {
    if (socket === null) return;

    const recipientId = currentChat?.members?.find((id) => id !== user?._id);

    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage, user, socket, currentChat]);

  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res: Message) => {
      if (currentChat?._id !== res.chatId) return;

      setMessages((prev) => [res, ...(prev || [])]);
    });

    socket.on(
      "messageReaction",
      (data: { messageId: string; reaction: string }) => {
        const { messageId, reaction } = data;

        setMessages((prevMessages) => {
          return (
            prevMessages?.map((msg) => {
              if (msg._id === messageId) {
                return {
                  ...msg,
                  reactions: [
                    ...(msg.reactions || []),
                    { userId: user?._id, reaction },
                  ],
                };
              }
              return msg;
            }) || []
          );
        });
      }
    );

    socket.on("getNotifications", (res: Message) => {
      if (!res.senderId) {
        return;
      }

      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);

      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...(prev || [])]);
      } else {
        setNotifications((prev) => [res, ...(prev || [])]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("messageReaction");
      socket.off("getNotifications");
    };
  }, [socket, currentChat, user]);

  const sendTextMessage = useCallback(
    async (
      textMessage: string,
      sender: User,
      currentChatId: string,
      file?: File,
      setMediaPreview?: (preview: null) => void
    ) => {
      if (!textMessage && !file)
        return console.log("You must type something or attach a file...");

      const formData = new FormData();
      formData.append("chatId", currentChatId);
      formData.append("senderId", sender._id);
      formData.append("text", textMessage);

      if (file) {
        formData.append("file", file);
      }

      const response = await postRequest(
        `${baseUrl}/messages`,
        formData,
        file ? setProgress : undefined,
        true,
        true
      );

      if (response.error) {
        return addNotification(response.message, "error");
      }

      setMediaPreview?.(null);
      setNewMessage(response);
      setMessages((prev) => [response, ...(prev || [])]);
    },
    [addNotification, setProgress]
  );

  const reactToMessage = useCallback(
    async (messageId: string, reaction: string) => {
      if (socket) {
        socket.emit("reactToMessage", {
          messageId,
          reaction,
          members: currentChat?.members,
        });
      }

      const response = await patchRequest(
        `${baseUrl}/messages/react/${messageId}`,
        { reaction },
        undefined,
        true
      );

      if (response.error) {
        return addNotification(response.message, "error");
      }

      setMessages(
        (prevMessages) =>
          prevMessages?.map((msg) =>
            msg._id === messageId
              ? { ...msg, reactions: response.messageUpdate.reactions }
              : msg
          ) || []
      );
    },
    [currentChat, socket, addNotification]
  );

  const markAllNotificationsAsRead = useCallback((notifications: Message[]) => {
    const mNotifications = notifications.map((n) => ({ ...n, isRead: true }));

    setNotifications(mNotifications);
  }, []);

  const martNotificationAsRead = useCallback(
    (n: any, userChats: Chat[], user: User, notifications: Message[]) => {
      const desiredChat = userChats.find((chat) => {
        const chatMembers = [user._id, n.senderId];
        const isDesiredChat = chat?.members.every((member: any) => {
          return chatMembers.includes(member);
        });

        return isDesiredChat;
      });

      const mNotification = notifications.map((el) => {
        if (n.senderId === el.senderId) {
          return { ...n, isRead: true };
        } else {
          return el;
        }
      });

      updateCurrentChat(desiredChat);
      setNotifications(mNotification);
    },
    [updateCurrentChat]
  );

  const markThisUserNotificationsAsRead = useCallback(
    (thisUserNotifications: any, notifications: Message[]) => {
      const mNotifications = notifications.map((el) => {
        let notification;

        thisUserNotifications.forEach((n) => {
          if (n.senderId === el.senderId) {
            notification = { ...n, isRead: true };
          } else {
            notification = el;
          }
        });

        return notification;
      });

      setNotifications(mNotifications);
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
        markAllNotificationsAsRead,
        martNotificationAsRead,
        markThisUserNotificationsAsRead,
        getMessages,
        hasMore,
        reactToMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
