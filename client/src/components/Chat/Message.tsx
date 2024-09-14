/* eslint-disable @typescript-eslint/no-explicit-any */
import { faFileText, faSmile } from "@fortawesome/free-regular-svg-icons";
import { faEllipsisV, faReply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import Picker, { EmojiClickData } from "emoji-picker-react";
import { PinIcon } from "../Icons";
import Avatar from "../Avatar";
import { AuthContext } from "../../context/AuthContext";
import moment from "moment";
import { User } from "../../types/auth";
import { MessageContext } from "../../context/MessageContext";
import { ChatContext } from "../../context/ChatContext";

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
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [pin, setPin] = useState<boolean>(false);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const moreRef = useRef<HTMLDivElement | null>(null);

  const { user } = useContext(AuthContext)!;
  const { reactToMessage } = useContext(MessageContext)!;

  const handleEmojiClick = (event: EmojiClickData) => {
    setSelectedEmoji(event.emoji);
    reactToMessage(msg?._id, event.emoji);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (emojiPickerRef.current &&
          !emojiPickerRef.current.contains(event.target as Node)) ||
        (moreRef.current && !moreRef.current.contains(event.target as Node))
      ) {
        setShowEmojiPicker(false);
        setShowMore(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (msg.reactions.length > 0) {
      setSelectedEmoji(msg?.reactions[0]?.reaction);
    }
  }, [msg]);

  return (
    <div key={msg._id}>
      {pin && (
        <span
          className={`d-block w-100 small ${
            msg.senderId === "Duy" ? "ms-5" : "text-end pe-5"
          }`}
          style={{ minWidth: "max-content" }}
        >
          Đã ghim
        </span>
      )}
      <div
        className={`position-relative item-message d-flex align-items-start ${
          msg.senderId === recipientUser?._id
            ? "justify-content-start"
            : "justify-content-end"
        }`}
      >
        {msg.senderId === recipientUser?._id ? (
          <>
            <div
              className="d-flex align-items-end me-2 mt-auto"
              style={{ width: "35px", height: "100%" }}
            >
              {showAvatar && (
                <Avatar
                  user={
                    msg.senderId === recipientUser?._id ? recipientUser : null
                  }
                  width={35}
                  height={35}
                />
              )}
            </div>
            <div
              className={`d-flex align-items-center message position-relative ${
                msg.type === "text" && "border border-secondary"
              } ${
                msg.type === "image" || (msg.type === "video" && "border-none")
              }`}
              style={{
                maxWidth: "75%",
                borderRadius: "50px 50px 50px 0",
                backgroundColor:
                  msg.type === "text" || msg.type === "file" ? "#ffffff" : "",
                border: msg.type === "file" ? "1px solid #ea67a4" : "",
                padding:
                  msg.type === "image" || msg.type === "video"
                    ? "0px !important"
                    : "8px",
              }}
            >
              {msg.mediaUrl ? (
                msg.type === "image" ? (
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
                ) : msg.type === "video" ? (
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
                ) : msg.type === "file" ? (
                  <a
                    href={msg.mediaUrl}
                    download
                    className="text-decoration-none text-black d-flex align-items-center"
                  >
                    <span className="mx-2">
                      <FontAwesomeIcon
                        icon={faFileText}
                        style={{ fontSize: "20px" }}
                      />
                    </span>
                    <div className="d-flex flex-column">
                      <span className="fw-bold">Tải về tập tin</span>
                      <span className="small">1.8 KB</span>
                    </div>
                  </a>
                ) : null
              ) : (
                <p className="m-0">{msg.text}</p>
              )}
              <span className="position-absolute z-2 top-0 start-100 time-message ms-2 small">
                {moment(msg.createdAt).calendar()}
              </span>
              {msg.reactions.length > 0 && (
                <div
                  className="d-flex position-absolute top-100 end-0 rounded-4"
                  style={{
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    backgroundColor: "var(--primary-light)",
                  }}
                >
                  {msg.reactions
                    .slice(0, 3)
                    .map((reaction: any, index: number) => (
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
                className={`position-absolute top-0 start-0 pin-icon ${
                  pin && "selected"
                }`}
              >
                <PinIcon />
              </span>
            </div>
            <div
              className={`m-auto control-message ms-2 d-flex align-items-center gap-1 ${
                showEmojiPicker || showMore ? "selected" : ""
              }`}
            >
              <span
                className={`position-relative icon-hover d-flex align-items-center justify-content-center rounded-circle ${
                  showEmojiPicker ? "selected" : ""
                }`}
                style={{ width: "2rem", height: "2rem" }}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <FontAwesomeIcon icon={faSmile} />
                {showEmojiPicker && (
                  <div
                    className="position-absolute bottom-100 start-50 mb-2"
                    style={{ zIndex: 1000, transform: "translateX(-50%)" }}
                    ref={emojiPickerRef}
                  >
                    <Picker
                      onEmojiClick={handleEmojiClick}
                      reactionsDefaultOpen={true}
                    />
                  </div>
                )}
              </span>
              <span
                className="icon-hover d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: "2rem", height: "2rem" }}
                onClick={() => {
                  setEdit(null);
                  setReplyingTo(msg);
                }}
              >
                <FontAwesomeIcon icon={faReply} />
              </span>
              <span
                className={`position-relative icon-hover d-flex align-items-center justify-content-center rounded-circle ${
                  showMore ? "selected" : ""
                }`}
                style={{ width: "2rem", height: "2rem" }}
                onClick={() => setShowMore(!showMore)}
              >
                <FontAwesomeIcon icon={faEllipsisV} />
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
          </>
        ) : (
          <>
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
                <FontAwesomeIcon icon={faEllipsisV} />
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
              <span
                className="icon-hover d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: "2rem", height: "2rem" }}
                onClick={() => {
                  setEdit(null);
                  setReplyingTo(msg);
                }}
              >
                <FontAwesomeIcon icon={faReply} />
              </span>
              <span
                className={`position-relative icon-hover d-flex align-items-center justify-content-center rounded-circle ${
                  showEmojiPicker ? "selected" : ""
                }`}
                style={{ width: "2rem", height: "2rem" }}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <FontAwesomeIcon icon={faSmile} />
                {showEmojiPicker && (
                  <div
                    className="position-absolute bottom-100 start-50 mb-2"
                    style={{ zIndex: 1000, transform: "translateX(-50%)" }}
                    ref={emojiPickerRef}
                  >
                    <Picker
                      onEmojiClick={handleEmojiClick}
                      reactionsDefaultOpen={true}
                    />
                  </div>
                )}
              </span>
            </div>
            <div
              className={
                "d-flex align-items-center text-white message position-relative"
              }
              style={{
                maxWidth: "75%",
                backgroundColor:
                  msg.type === "text"
                    ? "#ea67a4"
                    : msg.type === "file"
                    ? "#ffffff"
                    : "",
                borderRadius: "50px 50px 0 50px ",
                border: msg.type === "file" ? "1px solid #ea67a4" : "",
                padding:
                  msg.type === "image" || msg.type === "video"
                    ? "0px !important"
                    : "8px",
              }}
            >
              {msg.mediaUrl ? (
                msg.type === "image" ? (
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
                ) : msg.type === "video" ? (
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
                ) : msg.type === "file" ? (
                  <a
                    href={msg.mediaUrl}
                    download
                    className="text-decoration-none text-black d-flex align-items-center"
                  >
                    <span className="mx-2">
                      <FontAwesomeIcon
                        icon={faFileText}
                        style={{ fontSize: "20px" }}
                      />
                    </span>
                    <div className="d-flex flex-column">
                      <span className="fw-bold">Tải về tập tin</span>
                      <span className="small">1.8 KB</span>
                    </div>
                  </a>
                ) : null
              ) : (
                <p className="m-0">{msg.text}</p>
              )}
              <span className="position-absolute z-2 top-0 end-100 time-message me-2 small">
                {moment(msg.createdAt).calendar()}
              </span>
              {msg.reactions.length > 0 && (
                <div
                  className="d-flex position-absolute top-100 start-0 rounded-4"
                  style={{
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    backgroundColor: "var(--primary-light)",
                  }}
                >
                  {msg.reactions.map((reaction: any, index: number) => (
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
                className={`position-absolute top-0 end-0 pin-icon ${
                  pin && "selected"
                }`}
                style={{
                  rotate: "90deg",
                }}
              >
                <PinIcon />
              </span>
            </div>
            <div
              className="d-flex align-items-end ms-2 mt-auto"
              style={{ width: "35px", height: "100%" }}
            >
              {showAvatar && (
                <Avatar
                  user={msg.senderId !== recipientUser?._id ? user : null}
                  width={35}
                  height={35}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Message;
