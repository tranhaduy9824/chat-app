import { useContext, useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";
import { MessageContext } from "../context/MessageContext";

interface FetchLatestMessageProps {
  latestMessages: { chatId: string; latestMessage: Message | null }[];
}

export const useFetchLatestMessages = (
  chats: Chat[]
): FetchLatestMessageProps => {
  const [latestMessages, setLatestMessages] = useState<
    { chatId: string; latestMessage: Message | null }[]
  >([]);
  const { newMessage, notifications, messages } = useContext(MessageContext)!;

  useEffect(() => {
    const getMessages = async () => {
      const messages = await Promise.all(
        chats.map(async (chat) => {
          const response: { messages?: Message[]; error?: string } =
            await getRequest(
              `${baseUrl}/messages/${chat._id}?page=1&limit=10`,
              undefined,
              true
            );

          if (response.error) {
            console.error("Error getting messages:", response.error);
            return { chatId: chat._id, latestMessage: null };
          }

          if (response.messages && response.messages.length > 0) {
            const reverseMessage = response.messages.reverse();
            const lastMessage = reverseMessage[reverseMessage.length - 1];
            return { chatId: chat._id, latestMessage: lastMessage };
          }

          return { chatId: chat._id, latestMessage: null };
        })
      );
      setLatestMessages(messages);
    };

    if (chats?.length) {
      getMessages();
    }
  }, [chats, newMessage, notifications, messages]);

  return { latestMessages };
};