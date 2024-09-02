/* eslint-disable @typescript-eslint/no-explicit-any */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Users from "./Users";
import {
  faVideo,
  faEllipsisH,
  faStickyNote,
  faPaperPlane,
  faTimes,
  faCamera,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useRef, useState } from "react";
import { faImages, faSmile } from "@fortawesome/free-regular-svg-icons";
import Message from "./Message";
import Picker, { EmojiClickData } from "emoji-picker-react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useFetchRecipientUser } from "../hooks/useFetchRecipientUser";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import Avatar from "./Avatar";
import { MessageContext } from "../context/MessageContext";
import moment from "moment";

function BoxChat({ showInfoChat, setShowInfoChat }: any) {
  const [message, setMessage] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [replyingTo, setReplyingTo] = useState<null | Message>(null);
  const [edit, setEdit] = useState<null | Message>(null);

  const { user } = useContext(AuthContext)!;
  const { currentChat, onlineUsers } = useContext(ChatContext)!;
  const { messages, sendTextMessage } = useContext(MessageContext)!;
  const { recipientUser } = useFetchRecipientUser(currentChat, user);

  const handleSendMessage = () => {
    if (message.trim() || attachedFile) {
      sendTextMessage(message, user, currentChat?._id || "");
      setMessage("");
      setAttachedFile(null);
    }
    setReplyingTo(null);
    setEdit(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const handleEmojiClick = (
    event: EmojiClickData,
    emojiObject?: EmojiClickData
  ) => {
    if (emojiObject && emojiObject.emoji) {
      setMessage(message + emojiObject.emoji);
    } else if (event.emoji) {
      setMessage(message + event.emoji);
    }
  };

  const timeDiffInMinutes = (date1: Date, date2: Date): number => {
    const diffInMs = date2.getTime() - date1.getTime();
    return Math.floor(diffInMs / (1000 * 60));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [replyingTo, edit, messages]);

  return (
    <div
      className="flex-grow-1 h-100 p-3 overflow-hidden d-flex justify-content-between"
      style={{
        borderRadius: "var(--border-radius)",
        backgroundColor: "#e9ecf5",
      }}
    >
      <Users />
      <div className="flex-grow-1 ps-3 d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <Avatar
              user={recipientUser}
              style={{
                boxShadow:
                  "var(--primary-light) 0px 8px 24px, var(--primary-light) 0px 16px 56px, var(--primary-light) 0px 24px 80px",
              }}
            />
            <div>
              <p className="fw-bold m-0">{recipientUser?.fullname}</p>
              <span className="message-footer fa-sm">
                {onlineUsers?.some(
                  (user) => user?.userId === recipientUser?._id
                )
                  ? "Online"
                  : "Offline"}
              </span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            <Tippy content="Bắt đầu gọi video" placement="bottom">
              <span
                className="icon-hover d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: "2.1rem", height: "2.1rem" }}
              >
                <FontAwesomeIcon icon={faVideo} style={{ fontSize: "20px" }} />
              </span>
            </Tippy>
            <Tippy content="Thông tin về cuộc trò truyện" placement="bottom">
              <span
                className={`icon-hover d-flex align-items-center justify-content-center rounded-circle ${
                  showInfoChat && "selected"
                }`}
                style={{ width: "2.1rem", height: "2.1rem" }}
                onClick={() => setShowInfoChat(!showInfoChat)}
              >
                <FontAwesomeIcon
                  icon={faEllipsisH}
                  style={{ fontSize: "20px" }}
                />
              </span>
            </Tippy>
          </div>
        </div>
        <div className="flex-grow-1 overflow-x-hidden overflow-y-auto py-3">
          <div className="d-flex flex-column gap-2">
            {messages?.map((msg, index) => {
              const showTimestamp =
                index === 0 ||
                (messages[index - 1]?.createdAt &&
                  msg?.createdAt &&
                  timeDiffInMinutes(
                    new Date(messages[index - 1].createdAt),
                    new Date(msg.createdAt)
                  ) >= 10);
              const showAvatar =
                messages[index + 1]?.senderId !== msg.senderId ||
                timeDiffInMinutes(
                  new Date(msg.createdAt),
                  new Date(messages[index + 1].createdAt)
                ) >= 10;

              return (
                <div key={msg.id}>
                  {showTimestamp && (
                    <div className="text-center text-muted small my-2 fw-bold">
                      {moment(msg.createdAt).calendar()}
                    </div>
                  )}
                  <Message
                    msg={msg}
                    recipientUser={recipientUser}
                    showAvatar={showAvatar}
                    setReplyingTo={setReplyingTo}
                    setEdit={setEdit}
                  />
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
        {(replyingTo || edit) && (
          <div
            className="d-flex align-items-center justify-content-between"
            style={{ padding: "10px 0 5px", borderTop: "1px solid #7e889c" }}
          >
            <>
              <div>
                <div className="fw-bold">
                  {edit ? "Chỉnh sửa tin nhắn" : "Đang trả lời"}{" "}
                  {!edit &&
                    (replyingTo?.sender === "Duy" ? "Duy" : "Chính mình")}
                </div>
                <div className="small">{replyingTo?.text}</div>
              </div>
              <span
                className="icon-hover d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: "2rem", height: "2rem" }}
                onClick={() => {
                  setReplyingTo(null);
                  setEdit(null);
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </>
          </div>
        )}
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center gap-2">
            <Tippy content="Chụp ảnh">
              <span
                className="icon-hover d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: "2.1rem", height: "2.1rem" }}
              >
                <FontAwesomeIcon icon={faCamera} style={{ fontSize: "20px" }} />
              </span>
            </Tippy>
            <Tippy content="Đính kèm file">
              <label
                htmlFor="file-upload"
                className="icon-hover d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: "2.1rem", height: "2.1rem", cursor: "pointer" }}
              >
                <FontAwesomeIcon icon={faImages} style={{ fontSize: "20px" }} />
              </label>
            </Tippy>
            <input
              id="file-upload"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <Tippy content="Chọn file gif">
              <span
                className="icon-hover d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: "2.1rem", height: "2.1rem" }}
              >
                <FontAwesomeIcon
                  icon={faStickyNote}
                  style={{ fontSize: "20px" }}
                />
              </span>
            </Tippy>
          </div>
          <div className="position-relative flex-grow-1 mx-3">
            <input
              type="text"
              className="form-control rounded-pill me-2"
              style={{ paddingRight: "38px" }}
              placeholder="Enter message..."
              value={edit?.text || message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => setShowEmojiPicker(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <Tippy content="Chọn biểu tượng cảm xúc">
              <span
                className={`position-absolute top-0 end-0 icon-hover d-flex align-items-center justify-content-center rounded-circle ${
                  showEmojiPicker && "selected"
                }`}
                style={{ width: "2.1rem", height: "2.1rem", cursor: "pointer" }}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <FontAwesomeIcon icon={faSmile} style={{ fontSize: "20px" }} />
              </span>
            </Tippy>
            {showEmojiPicker && (
              <div
                className="position-absolute bottom-100 end-0 mb-2"
                style={{ zIndex: 1000 }}
                ref={emojiPickerRef}
              >
                <Picker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
          <button
            className="btn btn-primary rounded-pill"
            style={{ height: "100%", width: "auto", aspectRatio: "1/1" }}
            onClick={handleSendMessage}
          >
            {!edit ? (
              <FontAwesomeIcon icon={faPaperPlane} />
            ) : (
              <FontAwesomeIcon icon={faCheck} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BoxChat;
