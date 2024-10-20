const { Server } = require("socket.io");
const { handleUserConnection, handleUserDisconnection } = require("./users");
const {
  handleSendMessage,
  handleReactToMessage,
  handleReplyToMessage,
  handleDeleteMessage,
  handleEditMessage,
  handleTyping,
  handlePinMessage,
  handleUnpinMessage,
} = require("./messages");
const { handleChangeNickname } = require("./chat");
const { handleVideoCall } = require("./call");

const socketHandler = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "https://chat-app-zqoj.onrender.com",
      methods: ["GET", "POST"],
    },
  });

  let onlineUsers = [];

  io.on("connection", (socket) => {
    console.log("New connection", socket.id);

    handleUserConnection(io, socket, onlineUsers);
    handleUserDisconnection(io, socket, onlineUsers);
    handleSendMessage(io, socket, onlineUsers);
    handleReactToMessage(io, socket, onlineUsers);
    handleReplyToMessage(io, socket, onlineUsers);
    handleDeleteMessage(io, socket, onlineUsers);
    handleEditMessage(io, socket, onlineUsers);
    handleVideoCall(io, socket, onlineUsers);
    handleTyping(io, socket, onlineUsers);
    handlePinMessage(io, socket, onlineUsers);
    handleUnpinMessage(io, socket, onlineUsers);
    handleChangeNickname(io, socket, onlineUsers);
  });

  const socketPort = 3000;
  io.listen(socketPort);
};

module.exports = socketHandler;
