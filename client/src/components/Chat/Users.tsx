/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import Avatar from "../Avatar";
import { AuthContext } from "../../context/AuthContext";
import UserChat from "./UserChat";
import { MessageContext } from "../../context/MessageContext";
import { unReadNotificationsFunc } from "../../utils/unReadNotificationsFunc";
import { useTheme } from "../../context/ThemeContext";
import Search from "../Search";

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
        <Search />
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
          {allUsers
            .filter((u) => u._id !== user?._id)
            .map((u) => {
              const unReadNotifications = unReadNotificationsFunc(notifications);
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
        {userChats?.map((chat, index) => {
          const isSelected = chat._id === currentChat?._id;
          const previousChat =
            index > 0 && userChats[index - 1]._id === currentChat?._id;
          const nextChat =
            index < userChats.length - 1 &&
            userChats[index + 1]._id === currentChat?._id;

          return (
            <UserChat
              key={chat._id}
              chat={chat}
              user={user}
              isSelected={isSelected}
              updateCurrentChat={updateCurrentChat}
              previousChat={previousChat}
              nextChat={nextChat}
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
