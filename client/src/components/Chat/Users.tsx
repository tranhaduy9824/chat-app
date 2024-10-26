/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import Avatar from "../Avatar";
import { AuthContext } from "../../context/AuthContext";
import UserChat from "./UserChat";
import { MessageContext } from "../../context/MessageContext";
import { unReadNotificationsFunc } from "../../utils/unReadNotificationsFunc";
import { useTheme } from "../../context/ThemeContext";
import SearchUser from "./SearchUser";
import { useFetchLatestMessages } from "../../hooks/useFetchLatestMessages";

function Users() {
  const { user } = useContext(AuthContext)!;
  const {
    allUsers,
    userChats,
    createChat,
    currentChat,
    updateCurrentChat,
    onlineUsers,
  } = useContext(ChatContext)!;
  const { notifications, markThisUserNotificationsAsRead } =
    useContext(MessageContext)!;
  const { isDarkTheme } = useTheme();

  const [sortedChats, setSortedChats] = useState(userChats);

  const { latestMessages } = useFetchLatestMessages(userChats);

  useEffect(() => {
    const sorted = userChats
      ? [...userChats].sort((a, b) => {
          const latestMessageA = latestMessages.find(
            (msg) => msg.chatId === a._id
          )?.latestMessage;
          const latestMessageB = latestMessages.find(
            (msg) => msg.chatId === b._id
          )?.latestMessage;
          return (
            new Date(latestMessageB?.createdAt ?? 0).getTime() -
            new Date(latestMessageA?.createdAt ?? 0).getTime()
          );
        })
      : [];
    setSortedChats(sorted);
  }, [userChats, latestMessages]);

  const sortedUsers = [...allUsers].sort((a, b) => {
    const isAOnline = onlineUsers?.some((user) => user?.userId === a._id);
    const isBOnline = onlineUsers?.some((user) => user?.userId === b._id);
    return Number(isBOnline) - Number(isAOnline);
  });

  return (
    <div className="shadow-sm users-container">
      <div
        className="w-100 p-3"
        style={{
          backgroundColor: !isDarkTheme
            ? "var(--bg-cpn-light)"
            : "var(--bg-cpn-dark)",
        }}
      >
        <SearchUser />
      </div>
      <div
        className="list-friend px-3 d-flex align-items-center gap-3 overflow-x-auto pb-3"
        style={{
          backgroundColor: !isDarkTheme
            ? "var(--bg-cpn-light)"
            : "var(--bg-cpn-dark)",
        }}
      >
        <div className="list-friend d-flex align-items-center gap-3 overflow-x-auto">
          {sortedUsers
            .filter((u) => u._id !== user?._id)
            .map((u) => {
              const unReadNotifications =
                unReadNotificationsFunc(notifications);
              const thisUserNotification = unReadNotifications?.filter(
                (n: any) => n.senderId === u?._id
              );
              return (
                <div
                  key={u._id}
                  className="d-flex flex-column align-items-center position-relative"
                  onClick={() => {
                    if (user) {
                      createChat(user._id, u._id);
                    }
                    if (thisUserNotification?.length !== 0) {
                      markThisUserNotificationsAsRead(
                        thisUserNotification,
                        notifications
                      );
                    }
                  }}
                >
                  <Avatar user={u} />
                  <p className="fw-bold m-0">{u.fullname.split(" ").pop()}</p>
                  <div
                    className={`position-absolute end-0 rounded-circle ${
                      !onlineUsers?.some((user) => user?.userId === u?._id) &&
                      "d-none"
                    }`}
                    style={{
                      width: "15px",
                      height: "15px",
                      top: "35px",
                      backgroundColor: "#31a24c",
                    }}
                  ></div>
                </div>
              );
            })}
        </div>
      </div>
      <div
        className="d-flex flex-column overflow-y-auto"
        style={{ height: "max-content", maxHeight: "400px" }}
      >
        {sortedChats?.map((chat, index) => {
          const isSelected = chat._id === currentChat?._id;
          const previousChat =
            index > 0 && sortedChats[index - 1]._id === currentChat?._id;
          const nextChat =
            index < sortedChats.length - 1 &&
            sortedChats[index + 1]._id === currentChat?._id;

          const latestMessage = latestMessages.find(
            (msg) => msg.chatId === chat._id
          )?.latestMessage;

          return (
            <UserChat
              key={chat._id}
              chat={chat}
              user={user}
              isSelected={isSelected}
              updateCurrentChat={updateCurrentChat}
              previousChat={previousChat}
              nextChat={nextChat}
              latestMessage={latestMessage}
            />
          );
        })}
      </div>
      <div
        className="flex-grow-1"
        style={{
          backgroundColor: !isDarkTheme
            ? "var(--bg-cpn-light)"
            : "var(--bg-cpn-dark)",
        }}
      ></div>
    </div>
  );
}

export default Users;
