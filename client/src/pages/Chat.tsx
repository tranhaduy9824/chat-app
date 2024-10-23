import { useContext, useEffect, useLayoutEffect, useState } from "react";
import BoxChat from "../components/Chat/BoxChat";
import InfoChat from "../components/Chat/InfoChat";
import { ChatContext } from "../context/ChatContext";
import VideoCall from "../components/Modal/VideoCall";
import { AuthContext } from "../context/AuthContext";
import { useFetchRecipientUser } from "../hooks/useFetchRecipientUser";
import { DetailMedia } from "../components/Modal/DetailMedia";

function Chat() {
  const [showInfoChat, setShowInfoChat] = useState<boolean>(false);
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [canNotStart, setCanNotStart] = useState<boolean>(false);

  const { user } = useContext(AuthContext)!;
  const { currentChat, socket } = useContext(ChatContext)!;

  const { recipientUser } = useFetchRecipientUser(currentChat, user);

  useEffect(() => {
    const handleIncomingCall = () => {
      setIsCalling(true);
      setCanNotStart(true);
    };

    socket.on("incomingCall", handleIncomingCall);

    return () => {
      socket.off("incomingCall", handleIncomingCall);
    };
  }, [currentChat, socket]);

  useLayoutEffect(() => {
    const root = document.getElementById("root");

    const removeBackgroundImage = () => {
      if (root && root.style.backgroundImage) {
        root.style.removeProperty("background-image");
        console.log("Background image removed");
      }
    };

    removeBackgroundImage();

    const observer = new MutationObserver(removeBackgroundImage);

    if (root) {
      observer.observe(root, {
        attributes: true,
        attributeFilter: ["style"],
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className="d-flex justify-content-between align-items-center"
      style={{ height: "calc(100% - 3.25rem - 8px" }}
    >
      <BoxChat
        showInfoChat={showInfoChat}
        setShowInfoChat={setShowInfoChat}
        setIsCalling={setIsCalling}
        recipientUser={recipientUser}
      />
      {showInfoChat && currentChat && (
        <InfoChat recipientUser={recipientUser} />
      )}
      {isCalling && (
        <VideoCall
          socket={socket}
          currentChat={currentChat}
          user={user}
          isCalling={isCalling}
          setIsCalling={setIsCalling}
          canNotStart={canNotStart}
          setCanNotStart={setCanNotStart}
          recipientUser={recipientUser}
        />
      )}
      <DetailMedia />
    </div>
  );
}

export default Chat;
