import BoxChat from "../components/BoxChat";

function Chat() {
  return (
    <div
      className="d-flex justify-content-between align-items-center"
      style={{ height: "calc(100% - 3.25rem - 8px" }}
    >
      <BoxChat />
    </div>
  );
}

export default Chat;
