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

export const MessageContext = createContext<MessageContextProps | undefined>(
  undefined
);

interface MessageContextProviderProps {
  children: React.ReactNode;
}

export const MessageContextProvider: React.FC<MessageContextProviderProps> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[] | null>(null);

  const { currentChat } = useContext(ChatContext)!;

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

      setMessages((prev) => [...(prev || []), response]);
    },
    []
  );

  return (
    <MessageContext.Provider
      value={{
        messages,
        sendTextMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
