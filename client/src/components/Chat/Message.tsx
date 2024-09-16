import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { User } from "../../types/auth";
import PinnedLabel from "./PinnedLabel";
import MessageForRecipient from "./MessageForRecipient";
import MessageForSender from "./MessageForSender";

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
      {pin && <PinnedLabel senderId={msg.senderId} />}
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
