const handleSendMessage = (io, socket, onlineUsers) => {
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
};

const handleReactToMessage = (io, socket, onlineUsers) => {
  socket.on("reactToMessage", (reactionData) => {
    const { messageId, reaction, members } = reactionData;

    members.forEach((userId) => {
      const user = onlineUsers.find((user) => user.userId === userId);
      if (user) {
        io.to(user.socketId).emit("messageReaction", { messageId, reaction });
      }
    });
  });
};

module.exports = { handleSendMessage, handleReactToMessage };
