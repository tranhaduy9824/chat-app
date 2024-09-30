import { useContext, useEffect, useState } from "react";
import BoxChat from "../components/Chat/BoxChat";
import InfoChat from "../components/Chat/InfoChat";
import { ChatContext } from "../context/ChatContext";
import VideoCall from "../components/Chat/VideoCall";
import { AuthContext } from "../context/AuthContext";

function Chat() {
  const [showInfoChat, setShowInfoChat] = useState<boolean>(false);
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [canNotStart, setCanNotStart] = useState<boolean>(false);

  const { user } = useContext(AuthContext)!;
  const { currentChat, socket } = useContext(ChatContext)!;

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

  return (
    <div
      className="d-flex justify-content-between align-items-center"
      style={{ height: "calc(100% - 3.25rem - 8px" }}
    >
      <BoxChat
        showInfoChat={showInfoChat}
        setShowInfoChat={setShowInfoChat}
        setIsCalling={setIsCalling}
      />
      {showInfoChat && <InfoChat />}
      {isCalling && (
        <VideoCall
          socket={socket}
          currentChat={currentChat}
          user={user}
          isCalling={isCalling}
          setIsCalling={setIsCalling}
          canNotStart={canNotStart}
          setCanNotStart={setCanNotStart}
        />
      )}
    </div>
  );
}

export default Chat;
