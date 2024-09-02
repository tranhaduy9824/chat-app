import { useContext, useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";
import { MessageContext } from "../context/MessageContext";

interface FetchLatestMessageProps {
  latestMessage: Message | null;
}

export const useFetchLatestMessage = (
  chat: Chat | null
): FetchLatestMessageProps => {
  const [latestMessage, setLatestMessage] = useState<Message | null>(null);

  const { newMessage, notifications } = useContext(MessageContext)!;

  useEffect(() => {
    const getMessages = async () => {
      const response: Message[] | { error: string } = await getRequest(
        `${baseUrl}/messages/${chat?._id}`
      );

      if ("error" in response) {
        return console.log("Error getting messages...", response.error);
      }

      const lastMessage = response[response.length - 1];

      setLatestMessage(lastMessage);
    };

    getMessages();
  }, [chat, newMessage, notifications]);

  return { latestMessage };
};
