const { Server } = require("socket.io");

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

    socket.on("addNewUser", (userId) => {
      if (!onlineUsers.some((user) => user.userId === userId)) {
        onlineUsers.push({
          userId,
          socketId: socket.id,
        });
      }

      console.log("onlineUsers", onlineUsers);
      io.emit("getOnlineUsers", onlineUsers);
    });

    socket.on("sendMessage", (message) => {
      const user = onlineUsers.find(
        (user) => user.userId === message.recipientId
      );

      if (user) {
        io.to(user.socketId).emit("getMessage", message);
        io.to(user.socketId).emit("getNotifications", {
          senderId: message.senderId,
          isRead: false,
          date: new Date(),
        });
      }
    });

    socket.on("reactToMessage", (reactionData) => {
      const { messageId, reaction, members } = reactionData;

      console.log(reactionData);

      members.forEach((userId) => {
        const user = onlineUsers.find((user) => user.userId === userId);
        if (user) {
          io.to(user.socketId).emit("messageReaction", { messageId, reaction });
        }
      });
    });

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      io.emit("getOnlineUsers", onlineUsers);
    });
  });

  const socketPort = 3000;
  io.listen(socketPort);
};

module.exports = socketHandler;
