import { useState } from "react";
import BoxChat from "../components/BoxChat";
import InfoChat from "../components/InfoChat";

function Chat() {
  const [showInfoChat, setShowInfoChat] = useState<boolean>(false)

  return (
    <div
      className="d-flex justify-content-between align-items-center"
      style={{ height: "calc(100% - 3.25rem - 8px" }}
    >
      <BoxChat showInfoChat={showInfoChat} setShowInfoChat={setShowInfoChat} />
      {showInfoChat && <InfoChat />}
    </div>
  );
}

export default Chat;
