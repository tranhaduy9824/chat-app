import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { User } from "../../types/auth";
import LabelMessage from "./LabelMessage";
import MessageForRecipient from "./MessageForRecipient";
import MessageForSender from "./MessageForSender";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faFileText } from "@fortawesome/free-regular-svg-icons";

interface MessageProps {
  msg: Message;
  recipientUser: User | null;
  showAvatar: boolean;
  setReplyingTo: React.Dispatch<React.SetStateAction<null | Message>>;
  setEdit: React.Dispatch<React.SetStateAction<null | Message>>;
}

function Message({
  msg,
  recipientUser,
  showAvatar,
  setReplyingTo,
  setEdit,
}: MessageProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [pin, setPin] = useState<boolean>(false);

  const { user } = useContext(AuthContext)!;

  return (
    <div>
      {(pin || msg?.replyTo) && (
        <LabelMessage msg={msg} pin={pin} recipientUser={recipientUser} />
      )}
      {msg?.replyTo && (
        <div
          className="d-flex align-items-center message position-relative pb-3"
          style={{
            width: "max-content",
            maxWidth: "75%",
            marginBottom: "-16px",
            marginLeft: user?._id !== msg?.senderId ? "43px" : "auto",
            marginRight: user?._id !== msg?.senderId ? "0" : "43px",
            borderRadius:
              user?._id !== msg?.senderId
                ? "50px 50px 50px 0"
                : "50px 50px 0 50px ",
            backgroundColor:
              msg.replyTo.type === "text" || msg.replyTo.type === "file"
                ? "#dce2f0"
                : "",
            padding:
              msg.replyTo.mediaUrl && msg.replyTo.type !== "file"
                ? "0px !important"
                : "8px",
          }}
        >
          {msg.replyTo.type === "text" && (
            <p className="m-0">{msg.replyTo.text}</p>
          )}
          {msg.replyTo.type === "image" && (
            <img
              src={msg.replyTo.mediaUrl}
              alt="media"
              style={{
                maxWidth: "140px",
                maxHeight: "160px",
                marginBottom: "-16px",
                width: "auto",
                height: "auto",
                borderRadius: "10px",
                opacity: 0.5,
              }}
            />
          )}
          {msg.replyTo.type === "video" && (
            <video
              src={msg.replyTo.mediaUrl}
              style={{
                maxWidth: "140px",
                maxHeight: "160px",
                marginBottom: "-16px",
                width: "auto",
                height: "auto",
                borderRadius: "10px",
                opacity: 0.5,
              }}
            />
          )}
          {msg.replyTo.type === "file" && (
            <a className="text-decoration-none text-black d-flex align-items-center">
              <span className="mx-2">
                <FontAwesomeIcon
                  icon={faFileText as IconProp}
                  style={{
                    fontSize: "14px",
                    marginBottom: "-16px",
                    opacity: 0.5,
                  }}
                />
              </span>
              <div className="d-flex flex-column">
                <span className="fw-bold">Tải về tập tin</span>
                <span className="small">1.8 KB</span>
              </div>
            </a>
          )}
        </div>
      )}
      <div
        className={`position-relative item-message d-flex align-items-start ${
          msg.senderId === recipientUser?._id
            ? "justify-content-start"
            : "justify-content-end"
        }`}
      >
        {msg.senderId === recipientUser?._id ? (
          <MessageForRecipient
            msg={msg}
            showAvatar={showAvatar}
            recipientUser={recipientUser}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            showMore={showMore}
            setShowMore={setShowMore}
            pin={pin}
            setPin={setPin}
            setReplyingTo={setReplyingTo}
            setEdit={setEdit}
          />
        ) : (
          <MessageForSender
            msg={msg}
            showAvatar={showAvatar}
            user={user}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            showMore={showMore}
            setShowMore={setShowMore}
            pin={pin}
            setPin={setPin}
            setReplyingTo={setReplyingTo}
            setEdit={setEdit}
          />
        )}
      </div>
    </div>
  );
}

export default Message;
