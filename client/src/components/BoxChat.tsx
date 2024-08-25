import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Users from "./Users";
import {
  faVideo,
  faEllipsisH,
  faStickyNote,
  faPaperPlane,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { faImages, faSmile } from "@fortawesome/free-regular-svg-icons";
import Message from "./Message";
import Picker, { EmojiClickData } from "emoji-picker-react";

const messages: {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
}[] = [
  { id: 1, sender: "Duy", text: "Chào bạn!", timestamp: "10:00" },
  { id: 2, sender: "Bạn", text: "Chào Duy!", timestamp: "10:01" },
  { id: 3, sender: "Duy", text: "Bạn có khỏe không?", timestamp: "10:02" },
  { id: 4, sender: "Bạn", text: "Tôi khỏe, cảm ơn!", timestamp: "10:12" },
  {
    id: 5,
    sender: "Duy",
    text: "Bạn có dự định gì không?",
    timestamp: "10:22",
  },
  { id: 6, sender: "Bạn", text: "Chào Duy!", timestamp: "10:23" },
  { id: 7, sender: "Duy", text: "Bạn có khỏe không?", timestamp: "10:24" },
  { id: 8, sender: "Duy", text: "Bạn có khỏe không?", timestamp: "10:38" },
  { id: 9, sender: "Bạn", text: "Tôi khỏe, cảm ơn!", timestamp: "10:39" },
  { id: 10, sender: "Bạn", text: "Chào Duy!", timestamp: "10:40" },
  { id: 11, sender: "Duy", text: "Bạn có khỏe không?", timestamp: "10:50" },
  { id: 12, sender: "Bạn", text: "Tôi khỏe, cảm ơn!", timestamp: "10:51" },
];

function BoxChat() {
  const [message, setMessage] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [replyingTo, setReplyingTo] = useState<null | {
    id: number;
    sender: string;
    text: string;
    timestamp: string;
  }>(null);

  const handleSendMessage = () => {
    if (message.trim() || attachedFile) {
      console.log("Tin nhắn đã gửi:", message, attachedFile);
      setMessage("");
      setAttachedFile(null);
    }
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

  const timeDiffInMinutes = (time1: string, time2: string): number => {
    const [hours1, minutes1] = time1.split(":").map(Number);
    const [hours2, minutes2] = time2.split(":").map(Number);
    return (hours2 - hours1) * 60 + (minutes2 - minutes1);
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
  }, []);

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
            <img
              src="https://scontent.fdad1-4.fna.fbcdn.net/v/t1.15752-9/454583821_1018517906242047_1037832760614467948_n.png?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeFqGICRLsMdpmhCWZVEdV4oX98J-AHrGFhf3wn4AesYWLNMxYOhBQIg83QNUuFNISU57X2yBRk9z7P5rOpLCL0_&_nc_ohc=7Q_ZFTdXkpgQ7kNvgGqEZgO&_nc_ht=scontent.fdad1-4.fna&oh=03_Q7cD1QHLaUh-z3Dg4f1-eKQ0oSUzSxOdU3oKSJ1Y-0Dauombmg&oe=66EEB4DD"
              alt="Duy"
              className="rounded-circle mr-3"
              width={50}
              height={50}
            />
            <div>
              <p className="fw-bold m-0">Duy</p>
              <span className="message-footer fa-sm">Online</span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span
              className="icon-hover d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: "2.1rem", height: "2.1rem" }}
            >
              <FontAwesomeIcon icon={faVideo} style={{ fontSize: "20px" }} />
            </span>
            <span
              className="icon-hover d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: "2.1rem", height: "2.1rem" }}
            >
              <FontAwesomeIcon
                icon={faEllipsisH}
                style={{ fontSize: "20px" }}
              />
            </span>
          </div>
        </div>
        <div className="flex-grow-1 overflow-y-auto my-3">
          <div className="d-flex flex-column gap-2">
            {messages.map((msg, index) => {
              const showAvatar = messages[index + 1]?.sender !== msg.sender;
              const showTimestamp =
                index === 0 ||
                timeDiffInMinutes(
                  messages[index - 1].timestamp,
                  msg.timestamp
                ) >= 10;

              return (
                <div key={msg.id}>
                  {showTimestamp && (
                    <div className="text-center text-muted small my-2 fw-bold">
                      {msg.timestamp}
                    </div>
                  )}
                  <Message
                    msg={msg}
                    showAvatar={showAvatar}
                    setReplyingTo={setReplyingTo}
                  />
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
        {replyingTo && (
          <div
            className="d-flex align-items-center justify-content-between"
            style={{ padding: "10px 0 5px", borderTop: "1px solid #7e889c" }}
          >
            <div>
              <div className="fw-bold">
                Đang trả lời{" "}
                {replyingTo.sender === "Duy" ? "Duy" : "Chính mình"}
              </div>
              <div className="small">{replyingTo.text}</div>
            </div>
            <span
              className="icon-hover d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: "2rem", height: "2rem" }}
              onClick={() => setReplyingTo(null)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </div>
        )}
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center gap-2">
            <label
              htmlFor="file-upload"
              className="icon-hover d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: "2.1rem", height: "2.1rem", cursor: "pointer" }}
            >
              <FontAwesomeIcon icon={faImages} style={{ fontSize: "20px" }} />
            </label>
            <input
              id="file-upload"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <span
              className="icon-hover d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: "2.1rem", height: "2.1rem" }}
            >
              <FontAwesomeIcon
                icon={faStickyNote}
                style={{ fontSize: "20px" }}
              />
            </span>
          </div>
          <div className="position-relative flex-grow-1 mx-3">
            <input
              type="text"
              className="form-control rounded-pill me-2"
              placeholder="Enter message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => setShowEmojiPicker(false)}
            />
            <span
              className="position-absolute top-0 end-0 icon-hover d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: "2.1rem", height: "2.1rem", cursor: "pointer" }}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <FontAwesomeIcon icon={faSmile} style={{ fontSize: "20px" }} />
            </span>
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
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default BoxChat;
