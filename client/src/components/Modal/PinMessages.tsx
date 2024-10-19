import { useEffect } from "react";
import WrapperModal from "../WrapperModal";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import MessageContent from "../Chat/MessageContent";
import Avatar from "../Avatar";
import { AuthContext } from "../../context/AuthContext";
import { User } from "../../types/auth";

interface PinMessagesProps {
  show: boolean;
  onClose: () => void;
  recipientUser: User | null;
}

export const PinMessages = ({
  show,
  onClose,
  recipientUser,
}: PinMessagesProps) => {
  const { currentChat, getPinnedMessages, pinnedMessages } =
    useContext(ChatContext)!;
  const { user } = useContext(AuthContext)!;

  useEffect(() => {
    if (show) {
      getPinnedMessages();
    }
  }, [show, currentChat, getPinnedMessages]);

  return (
    <WrapperModal show={show} onClose={onClose}>
      <div style={{ width: "500px", height: "500px" }}>
        <p className="text-center fw-bold ">Tin nhắn đã ghim</p>
        {pinnedMessages.length > 0 ? (
          <div
            className="d-flex flex-column gap-3 overflow-y-auto overflow-x-hidden"
            style={{ height: "calc(100% - 40px)" }}
          >
            {[...pinnedMessages].reverse().map((message) => (
              <div
                className={`position-relative item-message d-flex align-items-start ${
                  message.senderId === recipientUser?._id
                    ? "justify-content-start"
                    : "justify-content-end"
                }`}
              >
                {message.senderId !== user?._id && (
                  <div
                    className="d-flex align-items-end me-2 mt-auto"
                    style={{ width: "35px", height: "100%" }}
                  >
                    <Avatar
                      user={message.senderId === user?._id ? user : null}
                      width={35}
                      height={35}
                    />
                  </div>
                )}
                <MessageContent msg={message} typePinMessage />
                {message.senderId === user?._id && (
                  <div
                    className="d-flex align-items-end ms-2 mt-auto"
                    style={{ width: "35px", height: "100%" }}
                  >
                    <Avatar
                      user={message.senderId === user?._id ? user : null}
                      width={35}
                      height={35}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">Không có tin nhắn đã ghim</p>
        )}
      </div>
    </WrapperModal>
  );
};
