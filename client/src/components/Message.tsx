import { faSmile } from "@fortawesome/free-regular-svg-icons";
import { faEllipsisV, faReply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import Picker, { EmojiClickData } from "emoji-picker-react";

interface MessageProps {
  msg: {
    id: number;
    sender: string;
    text: string;
    timestamp: string;
  };
  showAvatar: boolean;
}

function Message({ msg, showAvatar }: MessageProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  const handleEmojiClick = (event: EmojiClickData) => {
    setSelectedEmoji(event.emoji);
    setShowEmojiPicker(false);
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

  return (
    <div
      key={msg.id}
      className={`position-relative item-message d-flex align-items-start ${
        msg.sender === "Duy" ? "justify-content-start" : "justify-content-end"
      }`}
    >
      {msg.sender === "Duy" ? (
        <>
          <div
            className="d-flex align-items-center me-2 m-auto ms-0"
            style={{ width: "35px", height: "35px" }}
          >
            {showAvatar && (
              <img
                src="https://scontent.fdad1-4.fna.fbcdn.net/v/t1.15752-9/454583821_1018517906242047_1037832760614467948_n.png?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeFqGICRLsMdpmhCWZVEdV4oX98J-AHrGFhf3wn4AesYWLNMxYOhBQIg83QNUuFNISU57X2yBRk9z7P5rOpLCL0_&_nc_ohc=7Q_ZFTdXkpgQ7kNvgGqEZgO&_nc_ht=scontent.fdad1-4.fna&oh=03_Q7cD1QHLaUh-z3Dg4f1-eKQ0oSUzSxOdU3oKSJ1Y-0Dauombmg&oe=66EEB4DD"
                alt="Duy"
                className="rounded-circle"
                width={35}
                height={35}
              />
            )}
          </div>
          <div
            className={
              "d-flex align-items-center p-2 bg-white border border-secondary message position-relative"
            }
            style={{
              maxWidth: "75%",
              borderRadius: "50px 50px 50px 0",
            }}
          >
            <p className="m-0">{msg.text}</p>
            <span className="position-absolute z-2 top-0 start-100 time-message ms-2 small">
              {msg.timestamp}
            </span>
            {selectedEmoji && (
              <span
                className="position-absolute top-100 end-0 rounded-circle"
                style={{
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "var(--primary-light)",
                }}
              >
                {selectedEmoji}
              </span>
            )}
          </div>
          <div
            className={`m-auto control-message ms-2 d-flex align-items-center gap-1 ${
              showEmojiPicker ? "selected" : ""
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
            >
              <FontAwesomeIcon icon={faReply} />
            </span>
            <span
              className="icon-hover d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: "2rem", height: "2rem" }}
            >
              <FontAwesomeIcon icon={faEllipsisV} />
            </span>
          </div>
        </>
      ) : (
        <>
          <div
            className={`ml-auto my-auto control-message me-2 d-flex align-items-center gap-1 ${
              showEmojiPicker ? "selected" : ""
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
            >
              <FontAwesomeIcon icon={faReply} />
            </span>
            <span
              className="icon-hover d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: "2rem", height: "2rem" }}
            >
              <FontAwesomeIcon icon={faEllipsisV} />
            </span>
          </div>
          <div
            className={
              "d-flex align-items-center p-2 text-white message position-relative"
            }
            style={{
              maxWidth: "75%",
              backgroundColor: "#ea67a4",
              borderRadius: "50px 50px 0 50px ",
            }}
          >
            <p className="m-0">{msg.text}</p>
            <span className="position-absolute z-2 top-0 end-100 time-message me-2 small">
              {msg.timestamp}
            </span>
            {selectedEmoji && (
              <span
                className="position-absolute top-100 start-0 rounded-circle"
                style={{
                  transform: "translate(50%, -50%)",
                  backgroundColor: "var(--primary-light)",
                }}
              >
                {selectedEmoji}
              </span>
            )}
          </div>
          <div
            className="d-flex align-items-center ms-2 m-auto me-0"
            style={{ width: "35px", height: "35px" }}
          >
            {showAvatar && (
              <img
                src="https://scontent.fdad1-4.fna.fbcdn.net/v/t1.15752-9/454583821_1018517906242047_1037832760614467948_n.png?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeFqGICRLsMdpmhCWZVEdV4oX98J-AHrGFhf3wn4AesYWLNMxYOhBQIg83QNUuFNISU57X2yBRk9z7P5rOpLCL0_&_nc_ohc=7Q_ZFTdXkpgQ7kNvgGqEZgO&_nc_ht=scontent.fdad1-4.fna&oh=03_Q7cD1QHLaUh-z3Dg4f1-eKQ0oSUzSxOdU3oKSJ1Y-0Dauombmg&oe=66EEB4DD"
                alt="Duy"
                className="rounded-circle"
                width={35}
                height={35}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Message;
