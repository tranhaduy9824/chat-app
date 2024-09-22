/* eslint-disable @typescript-eslint/no-explicit-any */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { faFileText, faSmile } from "@fortawesome/free-regular-svg-icons";
import Picker, { EmojiClickData } from "emoji-picker-react";
import { PinIcon } from "../Icons";
import moment from "moment";
import { useContext, useEffect, useRef } from "react";
import { MessageContext } from "../../context/MessageContext";
import { AuthContext } from "../../context/AuthContext";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface MessageContentProps {
  msg: Message;
  showEmojiPicker: boolean;
  setShowEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
  showMore: boolean;
  setShowMore: React.Dispatch<React.SetStateAction<boolean>>;
  pin: boolean;
  setPin: React.Dispatch<React.SetStateAction<boolean>>;
  setReplyingTo: React.Dispatch<React.SetStateAction<null | Message>>;
  setEdit: React.Dispatch<React.SetStateAction<null | Message>>;
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
}: MessageContentProps) => {
  const moreRef = useRef<HTMLDivElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const { reactToMessage } = useContext(MessageContext)!;
  const { user } = useContext(AuthContext)!;

  const handleEmojiClick = (event: EmojiClickData) => {
    reactToMessage(msg?._id, event.emoji);
    setShowEmojiPicker(false);
  };

  const RenderEmoji = () => (
    <span
      className={`position-relative icon-hover d-flex align-items-center justify-content-center rounded-circle ${
        showEmojiPicker ? "selected" : ""
      }`}
      style={{ width: "2rem", height: "2rem" }}
      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
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
        setEdit(null);
        setReplyingTo(msg);
      }}
    >
      <FontAwesomeIcon icon={faReply as IconProp} />
    </span>
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setShowMore(false);
      }

      if (
        emojiPickerRef.current &&
        emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(true);
      } else {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowMore, setShowEmojiPicker]);

  return (
    <>
      {user?._id === msg?.senderId && (
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
            onClick={() => setShowMore(!showMore)}
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
                  <div
                    className="p-1 w-100"
                    onClick={() => {
                      setReplyingTo(null);
                      setEdit(msg);
                    }}
                  >
                    Chỉnh sửa
                  </div>
                  <div className="p-1 w-100">Thu hồi</div>
                  <div className="p-1 w-100" onClick={() => setPin(!pin)}>
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
        } ${user?._id === msg?.senderId && "text-white"}`}
        style={{
          maxWidth: "75%",
          borderRadius:
            user?._id !== msg?.senderId
              ? "50px 50px 50px 0"
              : "50px 50px 0 50px ",
          backgroundColor:
            user?._id !== msg?.senderId
              ? msg.type === "text" || msg.type === "file"
                ? "#ffffff"
                : ""
              : msg.type === "text"
              ? "#ea67a4"
              : msg.type === "file"
              ? "#ffffff"
              : "",
          border: msg.type === "file" ? "1px solid #ea67a4" : "",
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
              maxWidth: "280px",
              maxHeight: "300px",
              width: "auto",
              height: "auto",
              borderRadius: "10px",
            }}
          />
        )}
        {msg.type === "video" && (
          <video
            src={msg.mediaUrl}
            controls
            style={{
              maxWidth: "280px",
              maxHeight: "300px",
              width: "auto",
              height: "auto",
              borderRadius: "10px",
            }}
          />
        )}
        {msg.type === "file" && (
          <a
            href={msg.mediaUrl}
            download
            className="text-decoration-none text-black d-flex align-items-center"
          >
            <span className="mx-2">
              <FontAwesomeIcon
                icon={faFileText as IconProp}
                style={{ fontSize: "20px" }}
              />
            </span>
            <div className="d-flex flex-column">
              <span className="fw-bold">Tải về tập tin</span>
              <span className="small">1.8 KB</span>
            </div>
          </a>
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
              backgroundColor: "var(--primary-light)",
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
      {user?._id !== msg?.senderId && (
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
            onClick={() => setShowMore(!showMore)}
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
                  <div className="p-1" onClick={() => setPin(!pin)}>
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