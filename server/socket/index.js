const { Server } = require("socket.io");
const { handleUserConnection, handleUserDisconnection } = require("./users");
const { handleSendMessage, handleReactToMessage } = require("./messages");

const socketHandler = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  let onlineUsers = [];

  io.on("connection", (socket) => {
    console.log("New connection", socket.id);

    handleUserConnection(io, socket, onlineUsers);
    
    handleSendMessage(io, socket, onlineUsers);
    
    handleReactToMessage(io, socket, onlineUsers);
    
    handleUserDisconnection(io, socket, onlineUsers);
  });

  const socketPort = 3000;
  io.listen(socketPort);
};

module.exports = socketHandler;
