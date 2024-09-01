import { useFetchRecipientUser } from "../hooks/useFetchRecipientUser.js";
import { User } from "../types/auth.js";
import Avatar from "./Avatar.js";

interface UserChatProps {
  chat: Chat;
  user: User | null;
  isSelected: boolean;
  updateCurrentChat: (chat: Chat) => void;
  previousChat?: Chat | boolean;
  nextChat?: Chat | boolean;
}

const UserChat: React.FC<UserChatProps> = ({
  chat,
  user,
  isSelected,
  updateCurrentChat,
  previousChat,
  nextChat,
}) => {
  const { recipientUser } = useFetchRecipientUser(chat, user);

  return (
    <div style={{ backgroundColor: "#e9ecf5" }}>
      <div
        className={`item-user-chat d-flex align-items-center gap-2 bg-white position-relative py-2 px-3 ${
          isSelected ? "selected" : ""
        }`}
        onClick={() => updateCurrentChat(chat)}
        style={{
          borderRadius: previousChat
            ? "0 50px 0 0"
            : nextChat
            ? "0 0 50px 0"
            : "0",
        }}
      >
        <div>
          <Avatar user={recipientUser} />
          {recipientUser?.status && (
            <div
              className="position-absolute rounded-circle"
              style={{
                width: "15px",
                height: "15px",
                top: "43px",
                left: "51px",
                backgroundColor: "#31a24c",
              }}
            ></div>
          )}
        </div>
        <div className="flex-grow-1 pe-5">
          <span className="fw-bold">{recipientUser?.fullname}</span>
          <div>
            <span className="fa-sm">Xin chào nha </span>
            <span className="message-footer fa-sm">- 8 giờ trước</span>
          </div>
        </div>
        {recipientUser?.status && (
          <div
            className="position-absolute rounded-circle"
            style={{
              width: "15px",
              height: "15px",
              top: "50%",
              right: "36px",
              transform: "translateY(-50%)",
              backgroundColor: "#2e89ff",
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default UserChat;
