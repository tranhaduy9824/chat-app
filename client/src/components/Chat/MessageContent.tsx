/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReply,
  faEllipsisV,
  faPhoneSlash,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { faFileText, faSmile } from "@fortawesome/free-regular-svg-icons";
import Picker, { EmojiClickData } from "emoji-picker-react";
import { PinIcon } from "../Icons";
import moment from "moment";
import { useContext, useEffect, useRef } from "react";
import { MessageContext } from "../../context/MessageContext";
import { AuthContext } from "../../context/AuthContext";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { formatCallDuration, formatFileSize } from "../../utils/format";
import { ChatContext } from "../../context/ChatContext";

interface MessageContentProps {
  msg: Message;
  showEmojiPicker?: boolean;
  setShowEmojiPicker?: React.Dispatch<React.SetStateAction<boolean>>;
  showMore?: boolean;
  setShowMore?: React.Dispatch<React.SetStateAction<boolean>>;
  pin?: boolean;
  setPin?: React.Dispatch<React.SetStateAction<boolean>>;
  setReplyingTo?: React.Dispatch<React.SetStateAction<null | Message>>;
  setEdit?: React.Dispatch<React.SetStateAction<null | Message>>;
  typePinMessage?: boolean | undefined;
}

const MessageContent = ({
  msg,
  showEmojiPicker,
  setShowEmojiPicker,
  showMore,
  setShowMore,
  pin,
  setPin,
  setReplyingTo,
  setEdit,
  typePinMessage,
}: MessageContentProps) => {
  const moreRef = useRef<HTMLDivElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const { reactToMessage, deleteMessage } = useContext(MessageContext)!;
  const { user } = useContext(AuthContext)!;
  const { pinMessage, unpinMessage } = useContext(ChatContext)!;

  const handleEmojiClick = (event: EmojiClickData) => {
    reactToMessage(msg?._id, event.emoji);
    setShowEmojiPicker && setShowEmojiPicker(false);
  };

  const handlePinClick = async () => {
    if (pin) {
      await unpinMessage(msg._id);
    } else {
      await pinMessage(msg._id);
    }
    setPin && setPin(!pin);
  };

  const RenderEmoji = () => (
    <span
      className={`position-relative icon-hover d-flex align-items-center justify-content-center rounded-circle ${
        showEmojiPicker ? "selected" : ""
      }`}
      style={{ width: "2rem", height: "2rem" }}
      onClick={() => setShowEmojiPicker && setShowEmojiPicker(!showEmojiPicker)}
      ref={emojiPickerRef}
    >
      <FontAwesomeIcon icon={faSmile as IconProp} />
      {showEmojiPicker && (
        <div
          className="position-absolute bottom-100 start-50 mb-2"
          style={{ zIndex: 1000, transform: "translateX(-50%)" }}
        >
          <Picker onEmojiClick={handleEmojiClick} reactionsDefaultOpen={true} />
        </div>
      )}
    </span>
  );

  const RenderReply = () => (
    <span
      className="icon-hover d-flex align-items-center justify-content-center rounded-circle"
      style={{ width: "2rem", height: "2rem" }}
      onClick={() => {
        setEdit && setEdit(null);
        setReplyingTo && setReplyingTo(msg);
      }}
    >
      <FontAwesomeIcon icon={faReply as IconProp} />
    </span>
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setShowMore && setShowMore(false);
      }

      if (
        emojiPickerRef.current &&
        emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker && setShowEmojiPicker(true);
      } else {
        setShowEmojiPicker && setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowMore, setShowEmojiPicker]);

  const handleEditClick = () => {
    setEdit && setEdit(msg);
    setShowMore && setShowMore(false);
  };

  return (
    <>
      {!typePinMessage && user?._id === msg?.senderId && (
        <div
          className={`ml-auto my-auto control-message me-2 d-flex align-items-center gap-1 ${
            showEmojiPicker || showMore ? "selected" : ""
          }`}
        >
          <span
            className={`position-relative icon-hover d-flex align-items-center justify-content-center rounded-circle ${
              showMore ? "selected" : ""
            }`}
            style={{ width: "2rem", height: "2rem" }}
            onClick={() => setShowMore && setShowMore(!showMore)}
          >
            <FontAwesomeIcon icon={faEllipsisV as IconProp} />
            {showMore && (
              <div
                className="position-absolute start-50 bottom-100 border rounded p-2"
                style={{
                  zIndex: 1000,
                  transform: "translate(-50%, 0)",
                  backgroundColor: "#ffffff90",
                }}
                ref={moreRef}
              >
                <div
                  className="d-flex flex-column align-items-start"
                  style={{ minWidth: "max-content" }}
                >
                  {msg.type === "text" && (
                    <div className="p-1 w-100" onClick={handleEditClick}>
                      Chỉnh sửa
                    </div>
                  )}
                  <div
                    className="p-1 w-100"
                    onClick={() => deleteMessage(msg?._id)}
                  >
                    Thu hồi
                  </div>
                  <div className="p-1 w-100" onClick={handlePinClick}>
                    {!pin ? "Ghim" : "Bỏ ghim"}
                  </div>
                </div>
              </div>
            )}
          </span>
          <RenderReply />
          <RenderEmoji />
        </div>
      )}
      <div
        className={`d-flex align-items-center message position-relative ${
          user?._id !== msg?.senderId &&
          msg.type === "text" &&
          "border border-secondary"
        } ${
          user?._id !== msg?.senderId &&
          (msg.type === "image" || (msg.type === "video" && "border-none"))
        } ${user?._id === msg?.senderId ? "text-white" : "text-dark"}`}
        style={{
          maxWidth: "75%",
          borderRadius:
            user?._id !== msg?.senderId
              ? "50px 50px 50px 0"
              : "50px 50px 0 50px ",
          backgroundColor:
            user?._id !== msg?.senderId
              ? msg.type === "text" ||
                msg.type === "file" ||
                msg.type === "call"
                ? "#ffffff"
                : ""
              : msg.type === "text"
              ? "#ea67a4"
              : msg.type === "file"
              ? "#ffffff"
              : msg.type === "call"
              ? "#ffffff"
              : "",
          border:
            msg.type === "file"
              ? "1px solid #ea67a4"
              : msg.type === "call"
              ? "1px solid var(--bg-primary-gentle)"
              : "",
          padding:
            msg.type === "image" || msg.type === "video"
              ? "0px !important"
              : "8px",
        }}
      >
        {msg.type === "text" && <p className="m-0">{msg.text}</p>}
        {msg.type === "image" && (
          <img
            src={msg.mediaUrl}
            alt="media"
            style={{
              maxWidth: typePinMessage ? "130px" : "280px",
              maxHeight: typePinMessage ? "150px" : "300px",
              width: "auto",
              height: "auto",
              borderRadius: "10px",
            }}
            className="message-media"
          />
        )}
        {msg.type === "video" && (
          <video
            src={msg.mediaUrl}
            controls
            style={{
              maxWidth: typePinMessage ? "130px" : "280px",
              maxHeight: typePinMessage ? "150px" : "300px",
              width: "auto",
              height: "auto",
              borderRadius: "10px",
            }}
            className="message-media"
          />
        )}
        {msg.type === "file" && (
          <a
            href={msg.mediaUrl}
            download={msg.infoFile.name}
            className="text-decoration-none text-black d-flex align-items-center"
          >
            <span className="mx-2">
              <FontAwesomeIcon
                icon={faFileText as IconProp}
                style={{ fontSize: "20px" }}
              />
            </span>
            <div className="d-flex flex-column">
              <span className="fw-bold">{msg.infoFile.name}</span>
              <span className="small">{formatFileSize(msg.infoFile.size)}</span>
            </div>
          </a>
        )}
        {msg.type === "call" && (
          <div className="d-flex align-items-center text-black">
            <FontAwesomeIcon
              icon={
                msg.text.includes("missed")
                  ? (faPhoneSlash as IconProp)
                  : (faPhone as IconProp)
              }
              className="mx-2"
            />
            <span className="fw-bold">
              {msg.text.includes("missed") ? (
                "Cuộc gọi nhỡ"
              ) : (
                <>
                  Kết thúc cuộc gọi{" "}
                  <div className="fw-normal">
                    {formatCallDuration(msg?.callDuration)}
                  </div>
                </>
              )}
            </span>
          </div>
        )}
        <span
          className={`position-absolute z-2 top-0 time-message small ${
            user?._id === msg?.senderId ? "end-100 me-2" : "start-100 ms-2"
          }`}
        >
          {moment(msg.createdAt).calendar()}
        </span>
        {msg?.reactions?.length > 0 && (
          <div
            className={`d-flex position-absolute top-100 ${
              user?._id === msg?.senderId ? "start-0" : "end-0"
            } rounded-4`}
            style={{
              transform: "translateY(-50%)",
              cursor: "pointer",
              backgroundColor: "var(--bg-primary-gentle)",
            }}
          >
            {msg.reactions.slice(0, 3).map((reaction: any, index: number) => (
              <span
                key={index}
                style={{
                  fontSize: "14px",
                }}
              >
                {reaction.reaction}
              </span>
            ))}
            {msg.reactions.length > 3 && (
              <span className="small me-1">{msg.reactions.length}</span>
            )}
          </div>
        )}
        <span
          className={`position-absolute top-0 pin-icon ${pin && "selected"} ${
            user?._id === msg?.senderId ? "end-0" : "start-0"
          }`}
          style={{
            rotate: user?._id === msg?.senderId ? "90deg" : "0",
          }}
        >
          <PinIcon />
        </span>
      </div>
      {!typePinMessage && user?._id !== msg?.senderId && (
        <div
          className={`m-auto control-message ms-2 d-flex align-items-center gap-1 ${
            showEmojiPicker || showMore ? "selected" : ""
          }`}
        >
          <RenderEmoji />
          <RenderReply />
          <span
            className={`position-relative icon-hover d-flex align-items-center justify-content-center rounded-circle ${
              showMore ? "selected" : ""
            }`}
            style={{ width: "2rem", height: "2rem" }}
            onClick={() => setShowMore && setShowMore(!showMore)}
          >
            <FontAwesomeIcon icon={faEllipsisV as IconProp} />
            {showMore && (
              <div
                className="position-absolute start-50 bottom-100 border rounded-4 p-2"
                style={{
                  zIndex: 1000,
                  transform: "translate(-50%, 0)",
                  backgroundColor: "#ffffff90",
                }}
                ref={moreRef}
              >
                <div
                  className="d-flex flex-column align-items-start"
                  style={{ minWidth: "max-content" }}
                >
                  <div className="p-1" onClick={handlePinClick}>
                    {!pin ? "Ghim" : "Bỏ ghim"}
                  </div>
                </div>
              </div>
            )}
          </span>
        </div>
      )}
    </>
  );
};

export default MessageContent;
