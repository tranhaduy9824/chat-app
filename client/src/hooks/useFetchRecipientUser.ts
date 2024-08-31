/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";
import { User } from "../types/auth";
import { useLoading } from "../context/LoadingContext";

export const useFetchRecipientUser = (
  chat: Chat | null,
  user: User | null
): {
  recipientUser: User | null;
} => {
  const [recipientUser, setRecipientUser] = useState<User | null>(null);

  const { setProgress } = useLoading();

  const recipientId = chat?.members?.find((id) => id !== user?._id);

  useEffect(() => {
    const getUser = async () => {
      if (!recipientId) return;

      try {
        const response = await getRequest(
          `${baseUrl}/users/find/${recipientId}`,
          setProgress
        );

        if ("error" in response) {
          console.log(response.error);
        } else {
          setRecipientUser(response);
        }
      } catch (err) {
        console.log((err as Error).message);
      }
    };

    getUser();
  }, [recipientId]);

  return { recipientUser };
};
