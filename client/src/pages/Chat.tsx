import { useContext, useEffect, useState } from "react";
import BoxChat from "../components/Chat/BoxChat";
import InfoChat from "../components/Chat/InfoChat";
import { ChatContext } from "../context/ChatContext";
import VideoCall from "../components/Chat/VideoCall";
import { AuthContext } from "../context/AuthContext";

function Chat() {
  const [showInfoChat, setShowInfoChat] = useState<boolean>(false);
  const [isCalling, setIsCalling] = useState<boolean>(false);

  const { user } = useContext(AuthContext)!;
  const { currentChat, socket } = useContext(ChatContext)!;

  useEffect(() => {
    socket.on("incomingCall", ({ chatId }: { chatId: string }) => {
      setIsCalling(true);
    });

    return () => {
      socket.off("incomingCall");
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
        />
      )}
    </div>
  );
}

export default Chat;
