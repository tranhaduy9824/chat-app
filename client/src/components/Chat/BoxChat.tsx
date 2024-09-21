/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
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
import { useFetchRecipientUser } from "../../hooks/useFetchRecipientUser";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import Avatar from "../Avatar";
import { MessageContext } from "../../context/MessageContext";
import moment from "moment";
import backgroundImage from "../../assets/background-chat.png";
import MediaPreview from "./MediaPreview";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

function BoxChat({ showInfoChat, setShowInfoChat }: any) {
  const [page, setPage] = useState<number>(1);
  const [message, setMessage] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const [replyingTo, setReplyingTo] = useState<null | Message>(null);
  const [edit, setEdit] = useState<null | Message>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const inputMessageRef = useRef<HTMLInputElement | null>(null);

  const { user } = useContext(AuthContext)!;
  const { currentChat, onlineUsers } = useContext(ChatContext)!;
  const { messages, sendTextMessage, getMessages, hasMore, replyToMessage } =
    useContext(MessageContext)!;
  const { recipientUser } = useFetchRecipientUser(currentChat, user);

  useEffect(() => {
    if (attachedFile) {
      const sendFile = async () => {
        if (replyingTo) {
          setReplyingTo(null);
          setEdit(null);
          await replyToMessage(replyingTo._id, "", attachedFile, setMediaPreview);
        } else {
          await sendTextMessage(
            "",
            user,
            currentChat?._id || "",
            attachedFile,
            setMediaPreview
          );
        }
        setAttachedFile(null);
      };
      sendFile();
    }
  }, [attachedFile]);

  const handleSendMessage = () => {
    if (message.trim() || attachedFile) {
      if (replyingTo) {
        replyToMessage(replyingTo._id, message, attachedFile || undefined);
      } else {
        sendTextMessage(message, user, currentChat?._id || "");
      }
      setMessage("");
      setReplyingTo(null);
      setEdit(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiClick = (
    event: EmojiClickData,
    emojiObject?: EmojiClickData
  ) => {
    setMessage(message + (emojiObject?.emoji || event.emoji));
  };

  const timeDiffInMinutes = (date1: Date, date2: Date): number => {
    return Math.floor((date2.getTime() - date1.getTime()) / (1000 * 60));
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
    setPage(1);
  }, [currentChat]);

  useEffect(() => {
    if (currentChat) {
      getMessages(page, 10);
    }
  }, [currentChat, page]);

  const loadMoreMessages = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const chatMessagesElement = chatMessagesRef.current;
    if (chatMessagesElement) {
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = chatMessagesElement;
        if (clientHeight - scrollTop >= scrollHeight - 1) {
          loadMoreMessages();
        }
      };

      chatMessagesElement.addEventListener("scroll", handleScroll);
      return () => {
        chatMessagesElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, [hasMore, loadMoreMessages, currentChat]);

  useEffect(() => {
    if (inputMessageRef.current) {
      inputMessageRef.current.focus();
    }
  }, [replyingTo, edit]);

  console.log(messages);

  return (
    <div
      className="flex-grow-1 h-100 p-3 overflow-hidden d-flex justify-content-between"
      style={{
        borderRadius: "var(--border-radius)",
        backgroundColor: "#e9ecf5",
      }}
    >
      <Users />
      {!currentChat ? (
        <div className="flex-grow-1 ps-3 d-flex flex-column align-items-center justify-content-center">
          <h3>Welcome to ChatApp</h3>
          <img
            src={backgroundImage}
            alt="Background image"
            className="w-50 rounded-5 mt-2"
          />
        </div>
      ) : (
        <div className="flex-grow-1 ps-3 d-flex flex-column">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2 position-relative">
              <Avatar
                user={recipientUser}
                style={{
                  boxShadow:
                    "var(--primary-light) 0px 8px 24px, var(--primary-light) 0px 16px 56px, var(--primary-light) 0px 24px 80px",
                }}
              />
              <div
                className={`position-absolute rounded-circle ${
                  !onlineUsers?.some(
                    (user) => user?.userId === recipientUser?._id
                  ) && "d-none"
                }`}
                style={{
                  width: "15px",
                  height: "15px",
                  top: "35px",
                  left: "35px",
                  backgroundColor: "#31a24c",
                }}
              ></div>
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
                  <FontAwesomeIcon
                    icon={faVideo as IconProp}
                    style={{ fontSize: "20px" }}
                  />
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
                    icon={faEllipsisH as IconProp}
                    style={{ fontSize: "20px" }}
                  />
                </span>
              </Tippy>
            </div>
          </div>
          <div
            className="chat-messages flex-grow-1 overflow-x-hidden overflow-y-auto py-3 gap-2"
            ref={chatMessagesRef}
          >
            <div className="d-flex flex-column-reverse gap-2">
              {mediaPreview && (
                <MediaPreview
                  type={
                    attachedFile?.type.startsWith("image/")
                      ? "image"
                      : attachedFile?.type.startsWith("video/")
                      ? "video"
                      : "file"
                  }
                  mediaPreview={mediaPreview}
                />
              )}
              {messages?.map((msg, index) => {
                const showTimestamp =
                  index === messages?.length - 1 ||
                  (messages[index + 1]?.createdAt &&
                    msg?.createdAt &&
                    timeDiffInMinutes(
                      new Date(messages[index + 1].createdAt),
                      new Date(msg.createdAt)
                    ) >= 10);
                const showAvatar =
                  messages[index - 1]?.senderId !== msg.senderId ||
                  timeDiffInMinutes(
                    new Date(msg?.createdAt),
                    new Date(messages[index - 1]?.createdAt)
                  ) >= 10;

                return (
                  <div key={index}>
                    {showTimestamp && (
                      <div className="text-center text-muted small my-2 fw-bold">
                        {moment(msg.createdAt).calendar()}
                      </div>
                    )}
                    <Message
                      key={index}
                      msg={msg}
                      recipientUser={recipientUser}
                      showAvatar={showAvatar}
                      setReplyingTo={setReplyingTo}
                      setEdit={setEdit}
                    />
                  </div>
                );
              })}
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
                      (replyingTo?.senderId !== user?._id
                        ? recipientUser?.fullname
                        : "Chính mình")}
                  </div>
                  <div className="small">
                    {replyingTo?.text}{" "}
                    {replyingTo?.type === "video"
                      ? "Video"
                      : replyingTo?.type === "image"
                      ? "Hình ảnh"
                      : "File đính kèm"}
                  </div>
                </div>
                <span
                  className="icon-hover d-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: "2rem", height: "2rem" }}
                  onClick={() => {
                    setReplyingTo(null);
                    setEdit(null);
                  }}
                >
                  <FontAwesomeIcon icon={faTimes as IconProp} />
                </span>
              </>
            </div>
          )}
          <div className="d-flex align-items-center pt-2">
            <div className="d-flex align-items-center gap-2">
              <Tippy content="Chụp ảnh">
                <span
                  className="icon-hover d-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: "2.1rem", height: "2.1rem" }}
                >
                  <FontAwesomeIcon
                    icon={faCamera as IconProp}
                    style={{ fontSize: "20px" }}
                  />
                </span>
              </Tippy>
              <Tippy content="Đính kèm file">
                <label
                  htmlFor="file-upload"
                  className="icon-hover d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "2.1rem",
                    height: "2.1rem",
                    cursor: "pointer",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faImages as IconProp}
                    style={{ fontSize: "20px" }}
                  />
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
                    icon={faStickyNote as IconProp}
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
                ref={inputMessageRef}
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
                  style={{
                    width: "2.1rem",
                    height: "2.1rem",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <FontAwesomeIcon
                    icon={faSmile as IconProp}
                    style={{ fontSize: "20px" }}
                  />
                </span>
              </Tippy>
              {showEmojiPicker && (
                <div
                  className="position-absolute bottom-100 end-0 mb-2"
                  style={{ zIndex: 1000 }}
                  ref={emojiPickerRef}
                >
                  <Picker
                    onEmojiClick={(emojiObject) =>
                      handleEmojiClick(emojiObject)
                    }
                  />
                </div>
              )}
            </div>
            <button
              className="btn btn-primary rounded-pill"
              style={{ height: "100%", width: "auto", aspectRatio: "1/1" }}
              onClick={handleSendMessage}
            >
              {!edit ? (
                <FontAwesomeIcon icon={faPaperPlane as IconProp} />
              ) : (
                <FontAwesomeIcon icon={faCheck as IconProp} />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BoxChat;
