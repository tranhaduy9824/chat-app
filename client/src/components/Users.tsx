import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import Avatar from "./Avatar";
import { AuthContext } from "../context/AuthContext";
import UserChat from "./UserChat";

function Users() {
  const { user } = useContext(AuthContext)!;
  const { allUsers, userChats, createChat, currentChat, updateCurrentChat, onlineUsers } = useContext(ChatContext)!;

  return (
    <div
      className="bg-white py-3 shadow-sm"
      style={{
        borderRadius: "var(--border-radius)",
        minWidth: "450px",
        maxWidth: "450px",
      }}
    >
      <div className="w-100 px-3 mb-3 position-relative">
        <input
          type="text"
          className="form-control rounded-pill fw-bold"
          placeholder="Search"
          style={{ backgroundColor: "#e9ecf5", padding: "8px 50px 8px 12px" }}
        />
        <div
          className="d-flex align-items-center justify-content-center rounded-circle ml-2 position-absolute top-0 h-100"
          style={{
            width: "auto",
            aspectRatio: "1/1",
            right: "16px",
            border: "1px solid #dee2e6",
            backgroundColor: "#e9ecf5",
            cursor: "pointer",
          }}
        >
          <FontAwesomeIcon icon={faSearch} />
        </div>
      </div>
      <div className="list-friend mx-3 d-flex align-items-center gap-3 overflow-x-auto mb-3">
        {allUsers
          .filter((u) => u._id !== user?._id)
          .map((u) => (
            <div
              key={u._id} 
              className="d-flex flex-column align-items-center position-relative"
              onClick={() => {
                if (user) {
                  createChat(user._id, u._id);
                }
              }}
            >
              <Avatar user={u} />
              <p className="fw-bold m-0">{u.fullname.split(" ").pop()}</p>
                <div
                  className={`position-absolute end-0 rounded-circle ${!onlineUsers?.some((user) => user?.userId === u?._id) && "d-none"}`}
                  style={{
                    width: "15px",
                    height: "15px",
                    top: "35px",
                    backgroundColor: "#31a24c",
                  }}
                ></div>
            </div>
          ))}
      </div>
      <div
        className="d-flex flex-column overflow-y-auto"
        style={{ height: "400px" }}
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
    </div>
  );
}

export default Users;
